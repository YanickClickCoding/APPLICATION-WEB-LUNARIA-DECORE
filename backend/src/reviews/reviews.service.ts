import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../common/schemas/review.schema';

type ReviewDoc = Review & { _id: string };

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDoc>,
  ) {}

  create(userId: string, data: Partial<Review>) {
    return this.reviewModel.create({
      ...data,
      client: userId,
      status: 'EN_ATTENTE',
    });
  }

  findAll() {
    return this.reviewModel
      .find()
      .populate('client', 'firstName lastName')
      .populate('product', 'name')
      .populate('service', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  findByProduct(productId: string) {
    return this.reviewModel
      .find({ product: productId, status: 'APPROUVE' })
      .populate('client', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async approve(id: string) {
    const r = await this.reviewModel.findByIdAndUpdate(
      id,
      { status: 'APPROUVE', approvedAt: new Date() },
      { new: true },
    );
    if (!r) throw new NotFoundException();
    return r;
  }

  async remove(id: string) {
    const r = await this.reviewModel.findByIdAndDelete(id);
    if (!r) throw new NotFoundException();
    return { deleted: true };
  }
}
