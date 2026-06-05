import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DecorationServiceDocument = DecorationService & Document;

@Schema({ timestamps: true })
export class DecorationService {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true }) slug: string;
  @Prop({ required: true }) description: string;
  @Prop() shortDescription: string;
  @Prop({ type: Types.ObjectId, ref: 'Category' }) category: Types.ObjectId;
  @Prop({ required: true }) basePrice: number;
  @Prop() priceNote: string;
  @Prop([String]) images: string[];
  @Prop([String]) includes: string[];
  @Prop([{ name: String, price: Number }]) options: {
    name: string;
    price: number;
  }[];
  @Prop() duration: string;
  @Prop({ default: true }) isAvailable: boolean;
  @Prop({ default: false }) isArchived: boolean;
  @Prop({ default: false }) isFeatured: boolean;
  @Prop({
    type: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    default: () => ({ average: 0, count: 0 }),
  })
  ratings: { average: number; count: number };
}

export const DecorationServiceSchema =
  SchemaFactory.createForClass(DecorationService);
