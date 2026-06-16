import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  StockMovement,
  StockMovementDocument,
  StockMovementType,
} from '../common/schemas/stock-movement.schema';
import { Product, ProductDocument } from '../common/schemas/product.schema';

interface MovementInput {
  product: string;
  type: StockMovementType;
  quantity: number;
  reason?: string;
  supplier?: string;
}

@Injectable()
export class StockService {
  constructor(
    @InjectModel(StockMovement.name)
    private movementModel: Model<StockMovementDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  /** Enregistre un mouvement de stock et met à jour le stock du produit. */
  async createMovement(input: MovementInput) {
    const qty = Number(input.quantity);
    if (!qty || qty <= 0) {
      throw new BadRequestException('La quantité doit être supérieure à 0');
    }

    const product = await this.productModel.findById(input.product);
    if (!product) throw new NotFoundException('Produit introuvable');

    let newStock = product.stock ?? 0;
    if (input.type === 'IN') newStock += qty;
    else if (input.type === 'OUT') newStock -= qty;
    else if (input.type === 'ADJUST') newStock = qty; // valeur absolue d'inventaire
    else throw new BadRequestException('Type de mouvement invalide');

    if (newStock < 0) {
      throw new BadRequestException('Le stock ne peut pas être négatif');
    }

    product.stock = newStock;
    await product.save();

    return this.movementModel.create({
      product: input.product,
      type: input.type,
      quantity: qty,
      resultingStock: newStock,
      reason: input.reason,
      supplier: input.supplier || undefined,
    });
  }

  /** Historique des mouvements (optionnellement filtré par produit). */
  findMovements(productId?: string) {
    const filter = productId ? { product: productId } : {};
    return this.movementModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('product', 'name')
      .populate('supplier', 'name')
      .exec();
  }

  /** Produits dont le stock est au niveau ou sous le seuil d'alerte. */
  async findLowStock() {
    const products = await this.productModel
      .find({ isArchived: { $ne: true } })
      .select('name stock lowStockThreshold')
      .exec();
    return products.filter(
      (p) => (p.stock ?? 0) <= (p.lowStockThreshold ?? 5),
    );
  }
}
