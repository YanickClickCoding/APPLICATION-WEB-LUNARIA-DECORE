import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PromoCode, PromoCodeDocument } from '../common/schemas/promo.schema';

@Injectable()
export class PromosService {
  constructor(
    @InjectModel(PromoCode.name) private promoModel: Model<PromoCodeDocument>,
  ) {}

  findAll() {
    return this.promoModel.find().sort({ createdAt: -1 }).exec();
  }

  create(data: Partial<PromoCode>) {
    return this.promoModel.create({ ...data, code: data.code?.toUpperCase() });
  }

  async update(id: string, data: Partial<PromoCode>) {
    const promo = await this.promoModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    if (!promo) throw new NotFoundException();
    return promo;
  }

  async remove(id: string) {
    const promo = await this.promoModel.findByIdAndDelete(id);
    if (!promo) throw new NotFoundException();
    return { deleted: true };
  }

  // Valider un code promo lors du checkout
  async validate(code: string, orderAmount: number, userId: string) {
    const promo = await this.promoModel.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });
    if (!promo) throw new BadRequestException('Code promo invalide');

    const now = new Date();
    if (promo.validFrom && promo.validFrom > now)
      throw new BadRequestException("Ce code n'est pas encore actif");
    if (promo.validUntil && promo.validUntil < now)
      throw new BadRequestException('Ce code a expiré');
    if (promo.maxUses && promo.usedCount >= promo.maxUses)
      throw new BadRequestException(
        "Ce code a atteint sa limite d'utilisation",
      );
    if (promo.minOrderAmount && orderAmount < promo.minOrderAmount)
      throw new BadRequestException(
        `Montant minimum requis : ${promo.minOrderAmount} FCFA`,
      );
    if (promo.usedBy?.some((u) => String(u) === userId))
      throw new BadRequestException('Vous avez déjà utilisé ce code');

    const discount =
      promo.type === 'POURCENTAGE'
        ? Math.round(orderAmount * (promo.value / 100))
        : promo.value;

    return {
      valid: true,
      discount,
      code: promo.code,
      type: promo.type,
      value: promo.value,
    };
  }
}
