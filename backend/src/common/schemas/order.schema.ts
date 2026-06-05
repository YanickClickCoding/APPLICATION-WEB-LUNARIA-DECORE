import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true }) orderNumber: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  client: Types.ObjectId;
  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product' },
      service: { type: Types.ObjectId, ref: 'DecorationService' },
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      selectedOptions: [String],
    },
  ])
  items: object[];
  @Prop({ required: true }) subtotal: number;
  @Prop({ default: 0 }) deliveryFee: number;
  @Prop({ default: 0 }) discount: number;
  @Prop({ required: true }) total: number;
  @Prop() promoCode: string;
  @Prop({
    enum: [
      'EN_ATTENTE',
      'CONFIRME',
      'EN_PREPARATION',
      'PRET',
      'EN_LIVRAISON',
      'LIVRE',
      'ANNULE',
    ],
    default: 'EN_ATTENTE',
  })
  status: string;
  @Prop({ type: Object }) deliveryAddress: object;
  @Prop({ enum: ['DOMICILE', 'RETRAIT_BOUTIQUE', 'INSTALLATION_SITE'] })
  deliveryType: string;
  @Prop({ type: Types.ObjectId, ref: 'Payment' }) payment: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Delivery' }) delivery: Types.ObjectId;
  @Prop() notes: string;
  @Prop([{ status: String, date: Date, note: String }]) statusHistory: object[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ client: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
