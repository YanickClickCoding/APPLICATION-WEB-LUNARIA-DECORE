import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from '../common/schemas/cart.schema';
import { Product, ProductDocument } from '../common/schemas/product.schema';
import {
  DecorationService,
  DecorationServiceDocument,
} from '../common/schemas/decoration-service.schema';
import { CartItemDto } from './dto/cart-item.dto';

/** Ligne de panier normalisée (références + quantité), avant persistance. */
interface NormalizedItem {
  product?: Types.ObjectId;
  service?: Types.ObjectId;
  quantity: number;
  selectedOptions?: string[];
}

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(DecorationService.name)
    private serviceModel: Model<DecorationServiceDocument>,
  ) {}

  /** Renvoie le panier de l'utilisateur, peuplé et nettoyé des lignes orphelines. */
  async getCart(userId: string) {
    let cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product')
      .populate('items.service');

    if (!cart) {
      cart = await this.cartModel.create({ user: userId, items: [] });
      return cart;
    }

    // Filtre les lignes dont le produit/service a disparu (cohérence post-reseed)
    const items = (cart.items as any[]).filter(
      (it) => it.product || it.service,
    );
    if (items.length !== (cart.items as any[]).length) {
      cart.items = items;
      await cart.save();
    }
    return cart;
  }

  /** Remplace intégralement les lignes du panier (sync depuis le front). */
  async setCart(userId: string, items: CartItemDto[]) {
    const normalized = await this.normalize(items);
    await this.cartModel.findOneAndUpdate(
      { user: userId },
      { $set: { items: normalized }, $setOnInsert: { user: userId } },
      { upsert: true, new: true },
    );
    return this.getCart(userId);
  }

  /** Fusionne un panier invité dans celui du compte (additionne les quantités). */
  async merge(userId: string, guestItems: CartItemDto[]) {
    const cart = await this.cartModel.findOne({ user: userId });
    const current: NormalizedItem[] = cart
      ? (cart.items as any[]).map((it) => ({
          product: it.product,
          service: it.service,
          quantity: it.quantity,
          selectedOptions: it.selectedOptions,
        }))
      : [];

    const incoming = await this.normalize(guestItems);

    for (const inc of incoming) {
      const match = current.find(
        (c) =>
          String(c.product ?? '') === String(inc.product ?? '') &&
          String(c.service ?? '') === String(inc.service ?? ''),
      );
      if (match) match.quantity += inc.quantity;
      else current.push(inc);
    }

    await this.cartModel.findOneAndUpdate(
      { user: userId },
      { $set: { items: current }, $setOnInsert: { user: userId } },
      { upsert: true, new: true },
    );
    return this.getCart(userId);
  }

  async clear(userId: string) {
    await this.cartModel.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { upsert: true },
    );
    return this.getCart(userId);
  }

  /**
   * Transforme les DTO en lignes valides : ne garde que les produits/services
   * qui existent réellement, agrège les doublons.
   */
  private async normalize(items: CartItemDto[]): Promise<NormalizedItem[]> {
    if (!items?.length) return [];

    const productIds = items
      .filter((i) => i.product)
      .map((i) => i.product as string);
    const serviceIds = items
      .filter((i) => i.service)
      .map((i) => i.service as string);

    const [validProducts, validServices] = await Promise.all([
      productIds.length
        ? this.productModel.find({ _id: { $in: productIds } }).distinct('_id')
        : [],
      serviceIds.length
        ? this.serviceModel.find({ _id: { $in: serviceIds } }).distinct('_id')
        : [],
    ]);
    const validProductSet = new Set(validProducts.map(String));
    const validServiceSet = new Set(validServices.map(String));

    const out: NormalizedItem[] = [];
    for (const it of items) {
      const qty = Math.max(1, Math.floor(it.quantity || 1));
      if (it.product && validProductSet.has(String(it.product))) {
        const existing = out.find(
          (o) => String(o.product) === String(it.product),
        );
        if (existing) existing.quantity += qty;
        else
          out.push({
            product: new Types.ObjectId(it.product),
            quantity: qty,
            selectedOptions: it.selectedOptions,
          });
      } else if (it.service && validServiceSet.has(String(it.service))) {
        out.push({
          service: new Types.ObjectId(it.service),
          quantity: qty,
          selectedOptions: it.selectedOptions,
        });
      }
    }
    return out;
  }
}
