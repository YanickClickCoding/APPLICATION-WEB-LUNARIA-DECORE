import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../common/schemas/user.schema';
import { Order, OrderDocument } from '../common/schemas/order.schema';
import { Payment, PaymentDocument } from '../common/schemas/payment.schema';
import {
  DecorationPlanning,
  PlanningDocument,
} from '../common/schemas/planning.schema';
import {
  Conversation,
  ConversationDocument,
} from '../common/schemas/conversation.schema';
import { Delivery, DeliveryDocument } from '../common/schemas/delivery.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(DecorationPlanning.name)
    private planningModel: Model<PlanningDocument>,
    @InjectModel(Conversation.name)
    private convModel: Model<ConversationDocument>,
    @InjectModel(Delivery.name) private deliveryModel: Model<DeliveryDocument>,
  ) {}

  async getStats() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const [
      ordersTotal,
      ordersToday,
      ordersPending,
      revenueToday,
      revenueTotal,
      clientsTotal,
      clientsNew,
      planningPending,
      planningConfirmed,
      unreadMessages,
      deliveriesInProgress,
    ] = await Promise.all([
      this.orderModel.countDocuments(),
      this.orderModel.countDocuments({ createdAt: { $gte: todayStart } }),
      this.orderModel.countDocuments({ status: 'EN_ATTENTE' }),
      this.paymentModel
        .aggregate([
          { $match: { status: 'CONFIRME', paidAt: { $gte: todayStart } } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ])
        .then((r) => r[0]?.total ?? 0),
      this.paymentModel
        .aggregate([
          { $match: { status: 'CONFIRME' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ])
        .then((r) => r[0]?.total ?? 0),
      this.userModel.countDocuments({ role: 'CLIENT' }),
      this.userModel.countDocuments({
        role: 'CLIENT',
        createdAt: { $gte: weekStart },
      }),
      this.planningModel.countDocuments({ status: 'EN_ATTENTE' }),
      this.planningModel.countDocuments({ status: 'CONFIRME' }),
      this.convModel
        .aggregate([
          { $project: { unread: { $objectToArray: '$unreadCount' } } },
          { $unwind: '$unread' },
          { $match: { 'unread.v': { $gt: 0 } } },
          { $count: 'total' },
        ])
        .then((r) => r[0]?.total ?? 0),
      this.deliveryModel.countDocuments({
        status: { $in: ['ASSIGNE', 'RECUPERE', 'EN_ROUTE'] },
      }),
    ]);

    return {
      orders: {
        total: ordersTotal,
        today: ordersToday,
        pending: ordersPending,
      },
      revenue: { today: revenueToday, total: revenueTotal },
      clients: { total: clientsTotal, new: clientsNew },
      planning: { pending: planningPending, confirmed: planningConfirmed },
      messages: { unread: unreadMessages },
      deliveries: { inProgress: deliveriesInProgress },
    };
  }
}
