import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true }) slug: string;
  @Prop({ required: true }) description: string;
  @Prop() shortDescription: string;
  @Prop({ required: true }) price: number;
  @Prop() comparePrice: number;
  @Prop([String]) images: string[];
  // Catégorie principale (rétrocompat) + appartenance à plusieurs familles
  @Prop({ type: Types.ObjectId, ref: 'Category' }) category: Types.ObjectId;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }], default: [] })
  categories: Types.ObjectId[];
  @Prop([String]) tags: string[];
  @Prop({ default: 0 }) stock: number;
  @Prop({ default: 5 }) lowStockThreshold: number;
  @Prop({ type: Types.ObjectId, ref: 'Supplier' }) supplier: Types.ObjectId;
  @Prop({ default: true }) isAvailable: boolean;
  @Prop({ default: false }) isFeatured: boolean;
  @Prop({ default: false }) isArchived: boolean;
  @Prop({
    type: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    default: () => ({ average: 0, count: 0 }),
  })
  ratings: { average: number; count: number };
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, isAvailable: 1 });
ProductSchema.index({ categories: 1, isAvailable: 1 });
