import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../common/schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  findAll() {
    return this.categoryModel
      .find({ isActive: true })
      .sort({ order: 1 })
      .exec();
  }

  findAllAdmin() {
    return this.categoryModel.find().sort({ order: 1 }).exec();
  }

  async findById(id: string) {
    const cat = await this.categoryModel.findById(id);
    if (!cat) throw new NotFoundException('Catégorie introuvable');
    return cat;
  }

  async create(data: Partial<Category>) {
    const slug = this.toSlug(data.name ?? '');
    const exists = await this.categoryModel.findOne({ slug });
    if (exists) throw new ConflictException('Slug déjà utilisé');
    return this.categoryModel.create({ ...data, slug });
  }

  async update(id: string, data: Partial<Category>) {
    const cat = await this.categoryModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    if (!cat) throw new NotFoundException('Catégorie introuvable');
    return cat;
  }

  async remove(id: string) {
    const cat = await this.categoryModel.findByIdAndDelete(id);
    if (!cat) throw new NotFoundException('Catégorie introuvable');
    return { deleted: true };
  }

  private toSlug(name: string) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
