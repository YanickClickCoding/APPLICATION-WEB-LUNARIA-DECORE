import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Delivery, DeliveryDocument } from '../common/schemas/delivery.schema';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<DeliveryDocument>,
  ) {}

  async createForOrder(orderId: string, address: object, estimatedDate?: Date) {
    return this.deliveryModel.create({
      order: orderId,
      address,
      estimatedDate,
      statusHistory: [{ status: 'EN_ATTENTE', date: new Date() }],
    });
  }

  async findAll(page = 1, limit = 20, status?: string) {
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    const total = await this.deliveryModel.countDocuments(query);
    const data = await this.deliveryModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('order', 'orderNumber client total')
      .populate('livreur', 'firstName lastName phone')
      .exec();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByLivreur(livreurId: string) {
    return this.deliveryModel
      .find({ livreur: livreurId, status: { $nin: ['LIVRE', 'ECHEC'] } })
      .populate('order')
      .sort({ estimatedDate: 1 })
      .exec();
  }

  async findById(id: string) {
    const delivery = await this.deliveryModel
      .findById(id)
      .populate('order')
      .populate('livreur', 'firstName lastName phone');
    if (!delivery) throw new NotFoundException('Livraison introuvable');
    return delivery;
  }

  async assignLivreur(id: string, livreurId: string) {
    const delivery = await this.deliveryModel
      .findByIdAndUpdate(
        id,
        {
          livreur: livreurId,
          status: 'ASSIGNE',
          $push: { statusHistory: { status: 'ASSIGNE', date: new Date() } },
        },
        { new: true },
      )
      .populate('livreur', 'firstName lastName phone');
    if (!delivery) throw new NotFoundException();
    return delivery;
  }

  async updateStatus(
    id: string,
    status: string,
    note?: string,
    userId?: string,
  ) {
    const delivery = await this.deliveryModel.findById(id);
    if (!delivery) throw new NotFoundException();

    // Livreur ne peut modifier que ses propres livraisons
    if (userId && String(delivery.livreur) !== userId)
      throw new ForbiddenException();

    delivery.status = status;
    delivery.statusHistory.push({ status, date: new Date(), note });
    if (status === 'LIVRE') delivery.deliveredAt = new Date();
    return delivery.save();
  }

  async confirmReception(orderId: string) {
    return this.deliveryModel.findOneAndUpdate(
      { order: orderId },
      {
        status: 'LIVRE',
        deliveredAt: new Date(),
        $push: {
          statusHistory: {
            status: 'LIVRE',
            date: new Date(),
            note: 'Confirmé par le client',
          },
        },
      },
      { new: true },
    );
  }
}
