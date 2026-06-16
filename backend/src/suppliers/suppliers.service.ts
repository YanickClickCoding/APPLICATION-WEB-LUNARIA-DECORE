import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supplier, SupplierDocument } from '../common/schemas/supplier.schema';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
  ) {}

  findAll() {
    return this.supplierModel.find().sort({ name: 1 }).exec();
  }

  async findById(id: string) {
    const s = await this.supplierModel.findById(id);
    if (!s) throw new NotFoundException('Fournisseur introuvable');
    return s;
  }

  create(data: Partial<Supplier>) {
    return this.supplierModel.create(data);
  }

  async update(id: string, data: Partial<Supplier>) {
    const s = await this.supplierModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    if (!s) throw new NotFoundException('Fournisseur introuvable');
    return s;
  }

  async remove(id: string) {
    const s = await this.supplierModel.findByIdAndDelete(id);
    if (!s) throw new NotFoundException('Fournisseur introuvable');
    return { deleted: true };
  }
}
