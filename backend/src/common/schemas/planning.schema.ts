import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlanningDocument = DecorationPlanning & Document;

@Schema({ timestamps: true })
export class DecorationPlanning {
  @Prop({ required: true, unique: true }) planningNumber: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  client: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'DecorationService' })
  service: Types.ObjectId;
  @Prop({ required: true }) eventType: string;
  @Prop({ required: true }) eventDate: Date;
  @Prop({
    type: { type: String, address: String, ville: String, indications: String },
  })
  eventLocation: {
    type: string;
    address: string;
    ville: string;
    indications?: string;
  };
  @Prop() guestCount: number;
  @Prop() budgetMin: number;
  @Prop() budgetMax: number;
  @Prop([String]) inspirations: string[];
  @Prop() description: string;
  @Prop({
    enum: [
      'EN_ATTENTE',
      'DEVIS_ENVOYE',
      'DEVIS_ACCEPTE',
      'DEVIS_REFUSE',
      'CONFIRME',
      'EN_COURS',
      'TERMINE',
      'ANNULE',
    ],
    default: 'EN_ATTENTE',
  })
  status: string;
  @Prop({ type: { date: Date, timeSlot: String } }) visitSlot: {
    date: Date;
    timeSlot: string;
  };
  @Prop({ type: { date: Date, timeSlot: String } }) installationSlot: {
    date: Date;
    timeSlot: string;
  };
  @Prop({
    type: {
      amount: Number,
      description: String,
      validUntil: Date,
      sentAt: Date,
      respondedAt: Date,
    },
  })
  quote: {
    amount: number;
    description: string;
    validUntil: Date;
    sentAt: Date;
    respondedAt?: Date;
  };
  @Prop({ type: Types.ObjectId, ref: 'Payment' }) payment: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User' }) assignedTo: Types.ObjectId;
  @Prop([{ status: String, date: Date, note: String }]) statusHistory: object[];
}

export const PlanningSchema = SchemaFactory.createForClass(DecorationPlanning);
PlanningSchema.index({ client: 1, createdAt: -1 });
PlanningSchema.index({ eventDate: 1, status: 1 });
