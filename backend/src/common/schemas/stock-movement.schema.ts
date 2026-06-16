import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StockMovementDocument = StockMovement & Document;

export type StockMovementType = 'IN' | 'OUT' | 'ADJUST';

@Schema({ timestamps: true })
export class StockMovement {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  // IN = entrée (réassort), OUT = sortie (perte/casse), ADJUST = correction d'inventaire
  @Prop({ required: true, enum: ['IN', 'OUT', 'ADJUST'] })
  type: StockMovementType;

  // Quantité du mouvement (toujours positive ; le sens dépend de `type`)
  @Prop({ required: true }) quantity: number;

  // Stock résultant après application du mouvement (pour l'historique)
  @Prop({ required: true }) resultingStock: number;

  @Prop() reason: string;

  @Prop({ type: Types.ObjectId, ref: 'Supplier' })
  supplier: Types.ObjectId;
}

export const StockMovementSchema = SchemaFactory.createForClass(StockMovement);
StockMovementSchema.index({ product: 1, createdAt: -1 });
