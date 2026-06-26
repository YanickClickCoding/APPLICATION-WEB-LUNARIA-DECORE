import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  // Le client propriétaire de la conversation
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  client: Types.ObjectId;
  // L'agent (admin) qui répond — défini au premier message admin
  @Prop({ type: Types.ObjectId, ref: 'User' }) agent: Types.ObjectId;
  // Tous les participants (client + agents intervenus)
  @Prop([{ type: Types.ObjectId, ref: 'User' }]) participants: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Order' }) order: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'DecorationPlanning' })
  planning: Types.ObjectId;
  @Prop() subject: string;

  @Prop({
    type: {
      content: String,
      sentAt: Date,
      senderId: Types.ObjectId,
      senderRole: String,
    },
  })
  lastMessage: {
    content: string;
    sentAt: Date;
    senderId: Types.ObjectId;
    senderRole: string;
  };

  // Compteurs de non-lus séparés
  @Prop({ default: 0 }) clientUnread: number;
  @Prop({ default: 0 }) adminUnread: number;

  @Prop({ default: false }) isArchived: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
ConversationSchema.index({ client: 1, updatedAt: -1 });
ConversationSchema.index({ updatedAt: -1 });
// Une seule conversation active par client (garantit l'unicité même en cas de race)
ConversationSchema.index(
  { client: 1 },
  { unique: true, partialFilterExpression: { isArchived: false } },
);
