import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingGateway } from './messaging.gateway';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../common/schemas/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class MessagingController {
  constructor(
    private messagingService: MessagingService,
    private messagingGateway: MessagingGateway,
  ) {}

  @Get()
  getConversations(@CurrentUser() user: UserDocument) {
    return user.role === 'ADMIN'
      ? this.messagingService.getAdminConversations()
      : this.messagingService.getClientConversations(String(user._id));
  }

  @Get('unread')
  unread(@CurrentUser() user: UserDocument) {
    return this.messagingService.getUnreadTotal(String(user._id), user.role);
  }

  @Post()
  createOrGet(
    @CurrentUser() user: UserDocument,
    @Body() body: { subject?: string },
  ) {
    return this.messagingService.getOrCreateConversation(
      String(user._id),
      body.subject,
    );
  }

  @Get(':id/messages')
  getMessages(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.messagingService.getMessages(id, page, limit);
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
    @Body() body: { content: string; type?: string },
  ) {
    const { message, conversation } = await this.messagingService.createMessage(
      id,
      String(user._id),
      user.role,
      body.content,
      body.type,
    );

    this.messagingGateway.emitNewMessage({
      conversationId: id,
      message,
      content: body.content,
      senderRole: user.role,
      conversation,
    });

    return message;
  }

  @Post(':id/read')
  markRead(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.messagingService.markAsRead(id, String(user._id), user.role);
  }
}
