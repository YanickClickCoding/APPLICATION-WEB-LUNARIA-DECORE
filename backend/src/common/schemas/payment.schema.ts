import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, unique: true }) paymentNumber: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  client: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Order' }) order: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'DecorationPlanning' })
  planning: Types.ObjectId;
  @Prop({ required: true }) amount: number;
  @Prop({ default: 'XOF' }) currency: string;
  @Prop({ enum: ['MTN_MOMO', 'MOOV_MONEY'], required: true }) method: string;
  @Prop({ enum: ['COMMANDE', 'ACOMPTE', 'SOLDE'], required: true })
  type: string;
  @Prop({
    enum: ['EN_ATTENTE', 'EN_COURS', 'CONFIRME', 'ECHOUE', 'REMBOURSE'],
    default: 'EN_ATTENTE',
  })
  status: string;
  @Prop({ required: true }) phone: string;
  @Prop() transactionId: string;
  @Prop() externalRef: string;
  @Prop({ type: Object }) metadata: object;
  @Prop() paidAt: Date;
  @Prop() failReason: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.index({ client: 1, createdAt: -1 });
PaymentSchema.index({ transactionId: 1 });
