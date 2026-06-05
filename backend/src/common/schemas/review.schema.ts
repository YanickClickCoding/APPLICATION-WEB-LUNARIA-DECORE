import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  client: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Product' }) product: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'DecorationService' })
  service: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Order' }) order: Types.ObjectId;
  @Prop({ required: true, min: 1, max: 5 }) rating: number;
  @Prop() title: string;
  @Prop({ required: true }) comment: string;
  @Prop([String]) images: string[];
  @Prop({ enum: ['EN_ATTENTE', 'APPROUVE', 'REFUSE'], default: 'EN_ATTENTE' })
  status: string;
  @Prop() approvedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
