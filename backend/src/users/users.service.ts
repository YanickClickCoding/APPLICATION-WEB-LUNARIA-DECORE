import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../common/schemas/user.schema';
import { Product, ProductDocument } from '../common/schemas/product.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.userModel
      .find({ role: 'CLIENT' })
      .select('-password -otpCode -otpExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findById(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('-password -otpCode -otpExpires');
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async update(id: string, data: Partial<User>) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .select('-password -otpCode -otpExpires');
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async toggleActive(id: string) {
    const user = await this.findById(id);
    user.isActive = !user.isActive;
    return user.save();
  }

  async addFavorite(userId: string, productId: string) {
    // On n'ajoute en favori qu'un produit qui existe réellement
    const exists = await this.productModel.exists({ _id: productId });
    if (!exists) throw new NotFoundException('Produit introuvable');
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { favorites: productId } },
        { new: true },
      )
      .select('favorites');
  }

  async removeFavorite(userId: string, productId: string) {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { favorites: productId } },
        { new: true },
      )
      .select('favorites');
  }

  /**
   * Retourne les favoris du compte en éliminant les références orphelines
   * (produits supprimés, p.ex. après un re-seed). Purge la base si besoin
   * pour que le badge et la page restent cohérents.
   */
  async getCleanFavorites(userId: string): Promise<{ favorites: string[] }> {
    const user = await this.userModel.findById(userId).select('favorites');
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    const favorites = (user.favorites ?? []).map(String);
    if (favorites.length === 0) return { favorites: [] };

    const existing = await this.productModel
      .find({ _id: { $in: favorites } })
      .distinct('_id');
    const validIds = existing.map((id) => String(id));

    // Purge en base uniquement si des orphelins ont été détectés
    if (validIds.length !== favorites.length) {
      await this.userModel.findByIdAndUpdate(userId, {
        $set: { favorites: validIds },
      });
    }
    return { favorites: validIds };
  }
}
