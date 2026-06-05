import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../common/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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
}
