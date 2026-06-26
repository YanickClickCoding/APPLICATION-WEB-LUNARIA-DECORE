import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from '../common/schemas/conversation.schema';
import { Message, MessageDocument } from '../common/schemas/message.schema';

@Injectable()
export class MessagingService {
  constructor(
    @InjectModel(Conversation.name)
    private convModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private msgModel: Model<MessageDocument>,
  ) {}

  // ─── Conversations ────────────────────────────────────────────
  /** Récupère ou crée LA conversation de support d'un client */
  async getOrCreateConversation(clientId: string, subject?: string) {
    const clientOid = new Types.ObjectId(clientId);
    // Atomique : évite les doublons en cas d'appels simultanés (race condition).
    // $setOnInsert ne s'applique qu'à la création ; rien n'est écrasé si la conv existe.
    const conv = await this.convModel.findOneAndUpdate(
      { client: clientOid, isArchived: false },
      {
        $setOnInsert: {
          client: clientOid,
          participants: [clientOid],
          subject: subject ?? 'Conversation avec LUNARIA',
          clientUnread: 0,
          adminUnread: 0,
        },
      },
      { upsert: true, returnDocument: 'after' },
    );

    return this.convModel
      .findById(conv!._id)
      .populate('client', 'firstName lastName avatar role')
      .populate('agent', 'firstName lastName avatar role');
  }

  /** Côté client : sa conversation (souvent une seule) */
  getClientConversations(clientId: string) {
    return this.convModel
      .find({ client: new Types.ObjectId(clientId), isArchived: false })
      .populate('client', 'firstName lastName avatar role')
      .populate('agent', 'firstName lastName avatar role')
      .sort({ updatedAt: -1 })
      .exec();
  }

  /** Côté admin : TOUTES les conversations clients */
  getAdminConversations() {
    return this.convModel
      .find({ isArchived: false })
      .populate('client', 'firstName lastName avatar role phone')
      .populate('agent', 'firstName lastName avatar role')
      .sort({ updatedAt: -1 })
      .exec();
  }

  async getConversationById(id: string) {
    const conv = await this.convModel
      .findById(id)
      .populate('client', 'firstName lastName avatar role phone')
      .populate('agent', 'firstName lastName avatar role');
    if (!conv) throw new NotFoundException('Conversation introuvable');
    return conv;
  }

  // ─── Messages ─────────────────────────────────────────────────
  async getMessages(conversationId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const total = await this.msgModel.countDocuments({
      conversation: conversationId,
      isDeleted: false,
    });
    const data = await this.msgModel
      .find({ conversation: conversationId, isDeleted: false })
      .populate('sender', 'firstName lastName avatar role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    return { data: data.reverse(), total, page, limit };
  }

  /**
   * Crée un message. senderRole détermine qui reçoit le non-lu.
   * Retourne { message, conversation } pour que le gateway notifie les bons destinataires.
   */
  async createMessage(
    conversationId: string,
    senderId: string,
    senderRole: string,
    content: string,
    type = 'TEXT',
    attachments?: object[],
  ) {
    const message = await this.msgModel.create({
      conversation: conversationId,
      sender: senderId,
      content,
      type,
      attachments: attachments ?? [],
      readBy: [senderId],
    });

    const conv = await this.convModel.findById(conversationId);
    if (conv) {
      conv.lastMessage = {
        content,
        sentAt: new Date(),
        senderId: new Types.ObjectId(senderId),
        senderRole,
      };
      if (senderRole === 'ADMIN') {
        // L'admin devient l'agent de la conversation ; le client reçoit un non-lu
        conv.agent = new Types.ObjectId(senderId);
        conv.clientUnread += 1;
        if (!conv.participants.some((p) => String(p) === senderId)) {
          conv.participants.push(new Types.ObjectId(senderId));
        }
      } else {
        // Le client écrit → les admins reçoivent un non-lu
        conv.adminUnread += 1;
      }
      await conv.save();
    }

    const populated = await this.msgModel
      .findById(message._id)
      .populate('sender', 'firstName lastName avatar role');

    return { message: populated, conversation: conv };
  }

  /** Marque comme lu selon le rôle */
  async markAsRead(conversationId: string, userId: string, role: string) {
    await this.msgModel.updateMany(
      { conversation: conversationId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } },
    );
    const field = role === 'ADMIN' ? { adminUnread: 0 } : { clientUnread: 0 };
    await this.convModel.findByIdAndUpdate(conversationId, field);
    return { ok: true };
  }

  /** Total de non-lus pour la pastille globale */
  async getUnreadTotal(userId: string, role: string) {
    if (role === 'ADMIN') {
      const res = await this.convModel.aggregate([
        { $match: { isArchived: false } },
        { $group: { _id: null, total: { $sum: '$adminUnread' } } },
      ]);
      return { total: res[0]?.total ?? 0 };
    }
    const res = await this.convModel.aggregate([
      { $match: { client: new Types.ObjectId(userId), isArchived: false } },
      { $group: { _id: null, total: { $sum: '$clientUnread' } } },
    ]);
    return { total: res[0]?.total ?? 0 };
  }
}
