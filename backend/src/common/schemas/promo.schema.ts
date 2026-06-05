import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PromoCodeDocument = PromoCode & Document;

@Schema({ timestamps: true })
export class PromoCode {
  @Prop({ required: true, unique: true, uppercase: true }) code: string;
  @Prop() description: string;
  @Prop({ enum: ['POURCENTAGE', 'MONTANT_FIXE'], required: true }) type: string;
  @Prop({ required: true }) value: number;
  @Prop({ default: 0 }) minOrderAmount: number;
  @Prop() maxUses: number;
  @Prop({ default: 0 }) usedCount: number;
  @Prop([{ type: Types.ObjectId, ref: 'User' }]) usedBy: Types.ObjectId[];
  @Prop() validFrom: Date;
  @Prop() validUntil: Date;
  @Prop({ default: true }) isActive: boolean;
}

export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);
