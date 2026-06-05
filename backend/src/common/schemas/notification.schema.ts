import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
  @Prop({
    enum: [
      'COMMANDE_CONFIRMEE',
      'COMMANDE_LIVREE',
      'PAIEMENT_CONFIRME',
      'PAIEMENT_ECHOUE',
      'DEVIS_RECU',
      'PLANNING_CONFIRME',
      'NOUVEAU_MESSAGE',
      'LIVRAISON_EN_ROUTE',
    ],
  })
  type: string;
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) body: string;
  @Prop({ type: Object }) data: object;
  @Prop({ default: false }) isRead: boolean;
  @Prop() readAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
