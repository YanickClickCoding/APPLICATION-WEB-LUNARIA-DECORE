import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User' }) user: Types.ObjectId;
  @Prop() sessionId: string;
  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product' },
      service: { type: Types.ObjectId, ref: 'DecorationService' },
      quantity: { type: Number, default: 1 },
      price: Number,
      selectedOptions: [String],
    },
  ])
  items: object[];
  @Prop({ default: 0 }) total: number;
  @Prop({ type: Date, expires: 604800 }) expiresAt: Date; // TTL 7j pour paniers anonymes
}

export const CartSchema = SchemaFactory.createForClass(Cart);
