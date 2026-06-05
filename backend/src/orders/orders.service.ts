import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../common/schemas/order.schema';

interface CreateOrderDto {
  userId: string;
  items: {
    product?: string;
    service?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: object;
  deliveryType: string;
  promoCode?: string;
  discount?: number;
  notes?: string;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(dto: CreateOrderDto) {
    const orderNumber = `LUN-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    const order = await this.orderModel.create({
      ...dto,
      client: dto.userId,
      orderNumber,
      statusHistory: [{ status: 'EN_ATTENTE', date: new Date() }],
    });
    return order.populate('client', 'firstName lastName phone email');
  }

  async findByClient(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await this.orderModel.countDocuments({ client: userId });
    const data = await this.orderModel
      .find({ client: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('payment')
      .exec();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAll(page = 1, limit = 20, status?: string) {
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    const total = await this.orderModel.countDocuments(query);
    const data = await this.orderModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('client', 'firstName lastName phone')
      .populate('payment')
      .exec();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string, userId?: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('client', 'firstName lastName phone email')
      .populate('payment')
      .populate('delivery');
    if (!order) throw new NotFoundException('Commande introuvable');
    if (userId && String(order.client['_id']) !== userId)
      throw new ForbiddenException('Accès refusé');
    return order;
  }

  async updateStatus(id: string, status: string, note?: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Commande introuvable');
    order.status = status;
    order.statusHistory.push({ status, date: new Date(), note });
    return order.save();
  }

  async cancel(id: string, userId: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Commande introuvable');
    if (String(order.client) !== userId) throw new ForbiddenException();
    if (!['EN_ATTENTE', 'CONFIRME'].includes(order.status))
      throw new ForbiddenException(
        "Impossible d'annuler une commande en cours de livraison",
      );
    return this.updateStatus(id, 'ANNULE', 'Annulée par le client');
  }

  async linkPayment(orderId: string, paymentId: string) {
    return this.orderModel.findByIdAndUpdate(
      orderId,
      { payment: paymentId },
      { new: true },
    );
  }
}
