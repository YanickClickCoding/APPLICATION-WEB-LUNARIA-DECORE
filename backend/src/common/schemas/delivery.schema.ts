import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DeliveryDocument = Delivery & Document;

@Schema({ timestamps: true })
export class Delivery {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  order: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User' }) livreur: Types.ObjectId;
  @Prop({
    enum: ['EN_ATTENTE', 'ASSIGNE', 'RECUPERE', 'EN_ROUTE', 'LIVRE', 'ECHEC'],
    default: 'EN_ATTENTE',
  })
  status: string;
  @Prop({ type: Object }) address: object;
  @Prop() estimatedDate: Date;
  @Prop() deliveredAt: Date;
  @Prop() notes: string;
  @Prop([{ status: String, date: Date, note: String }]) statusHistory: object[];
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
