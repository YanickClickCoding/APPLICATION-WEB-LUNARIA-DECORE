import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '../common/schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notifModel: Model<NotificationDocument>,
  ) {}

  create(
    userId: string,
    type: string,
    title: string,
    body: string,
    data?: object,
  ) {
    return this.notifModel.create({ user: userId, type, title, body, data });
  }

  findByUser(userId: string) {
    return this.notifModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }

  async markAllRead(userId: string) {
    await this.notifModel.updateMany(
      { user: userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
    return { ok: true };
  }

  async markRead(id: string) {
    return this.notifModel.findByIdAndUpdate(
      id,
      { isRead: true, readAt: new Date() },
      { new: true },
    );
  }

  remove(id: string) {
    return this.notifModel.findByIdAndDelete(id);
  }
}
