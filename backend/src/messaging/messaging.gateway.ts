import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessagingService } from './messaging.service';

interface AuthSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/chat',
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  // userId → ensemble de socketIds
  private connectedUsers = new Map<string, Set<string>>();
  // ensemble des userId admins connectés
  private adminUsers = new Set<string>();

  private emitUserPresenceForAdmins(userId: string, isOnline: boolean) {
    this.adminUsers.forEach((adminId) => {
      this.server.to(adminId).emit('user_presence', { userId, isOnline });
    });
  }

  constructor(
    private messagingService: MessagingService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * Diffuse un message + notifs/pastille (même logique que depuis socket).
   * Utilisé aussi par le contrôleur REST.
   */
  emitNewMessage(params: {
    conversationId: string;
    message: any;
    content: string;
    senderRole: string;
    conversation?: any;
  }) {
    const { conversationId, message, content, senderRole, conversation } =
      params;

    // 1) Diffuser le message à la fenêtre de chat ouverte (membres de la room)
    this.server.to(conversationId).emit('new_message', message);

    // 2) Notification globale (pastille) au(x) destinataire(s)
    const notif = {
      conversationId,
      preview: String(content ?? '').slice(0, 80),
      from: senderRole === 'ADMIN' ? 'agent' : 'client',
    };

    if (senderRole === 'ADMIN') {
      const clientId = String(conversation?.client);
      if (clientId) this.notifyUser(clientId, 'message_notification', notif);
    } else {
      this.notifyAdmins('message_notification', notif);
    }
  }

  async handleConnection(client: AuthSocket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      client.userId = payload.sub;
      client.userRole = payload.role;

      if (!this.connectedUsers.has(payload.sub)) {
        this.connectedUsers.set(payload.sub, new Set());
      }
      this.connectedUsers.get(payload.sub)!.add(client.id);
      if (payload.role === 'ADMIN') this.adminUsers.add(payload.sub);

      // présence : l'utilisateur vient de se connecter
      this.emitUserPresenceForAdmins(payload.sub, true);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthSocket) {
    if (client.userId) {
      const sockets = this.connectedUsers.get(client.userId);
      sockets?.delete(client.id);
      if (sockets?.size === 0) {
        this.connectedUsers.delete(client.userId);
        this.adminUsers.delete(client.userId);

        // présence : l'utilisateur est offline
        this.emitUserPresenceForAdmins(client.userId, false);
      }
    }
  }

  @SubscribeMessage('join_conversation')
  async joinConversation(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    await client.join(data.conversationId);
    await this.messagingService.markAsRead(
      data.conversationId,
      client.userId!,
      client.userRole!,
    );
    // Prévenir l'autre partie que ses messages ont été vus (accusé de lecture)
    client.to(data.conversationId).emit('message_seen', {
      userId: client.userId,
      conversationId: data.conversationId,
    });
    return { ok: true };
  }

  @SubscribeMessage('leave_conversation')
  async leaveConversation(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    await client.leave(data.conversationId);
    return { ok: true };
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody()
    data: { conversationId: string; content: string; type?: string },
  ) {
    console.log('[MessagingGateway] send_message', {
      conversationId: data.conversationId,
      senderId: client.userId,
      senderRole: client.userRole,
      contentPreview: data.content?.slice?.(0, 40),
      socketId: client.id,
    });

    const { message, conversation } = await this.messagingService.createMessage(
      data.conversationId,
      client.userId!,
      client.userRole!,
      data.content,
      data.type ?? 'TEXT',
    );

    this.emitNewMessage({
      conversationId: data.conversationId,
      message,
      content: data.content,
      senderRole: client.userRole!,
      conversation,
    });

    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    client
      .to(data.conversationId)
      .emit('user_typing', { userId: client.userId, role: client.userRole });
  }

  @SubscribeMessage('mark_read')
  async markRead(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    await this.messagingService.markAsRead(
      data.conversationId,
      client.userId!,
      client.userRole!,
    );

    // event générique (utilisé côté admin pour marquer les messages "vus")
    client.to(data.conversationId).emit('messages_read', {
      userId: client.userId,
      conversationId: data.conversationId,
    });

    // event de confirmation de lecture plus explicite
    client.to(data.conversationId).emit('message_seen', {
      userId: client.userId,
      conversationId: data.conversationId,
    });

    return { ok: true };
  }

  // Liste des utilisateurs actuellement connectés (présence initiale)
  @SubscribeMessage('get_online_users')
  getOnlineUsers() {
    return Array.from(this.connectedUsers.keys());
  }

  // ─── Helpers ──────────────────────────────────────────────────
  notifyUser(userId: string, event: string, data: unknown) {
    const sockets = this.connectedUsers.get(userId);
    if (sockets)
      sockets.forEach((sid) => this.server.to(sid).emit(event, data));
  }

  notifyAdmins(event: string, data: unknown) {
    this.adminUsers.forEach((adminId) => this.notifyUser(adminId, event, data));
  }
}
