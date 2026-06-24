import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Product, ProductDocument } from '../common/schemas/product.schema';

type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'recent';

interface ProductFilter {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: SortKey;
}

const SORT_MAP: Record<SortKey, Record<string, 1 | -1>> = {
  popular: { isFeatured: -1, 'ratings.average': -1, createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  recent: { createdAt: -1 },
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(filter: ProductFilter = {}) {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
      sort = 'popular',
    } = filter;
    const query: Record<string, unknown> = {
      isArchived: false,
      isAvailable: true,
    };

    if (category) {
      // Accepte un ObjectId (id de catégorie) ou un slug de catégorie.
      // Certains produits ont pu être enregistrés avec category en string :
      // on matche donc à la fois l'ObjectId ET sa forme chaîne.
      query.category = isValidObjectId(category)
        ? { $in: [new Types.ObjectId(category), category] }
        : category;
    }
    if (search) query.$text = { $search: search };
    if (minPrice || maxPrice) {
      query.price = {
        ...(minPrice ? { $gte: minPrice } : {}),
        ...(maxPrice ? { $lte: maxPrice } : {}),
      };
    }

    const total = await this.productModel.countDocuments(query);
    const data = await this.productModel
      .find(query)
      .populate('category', 'name slug')
      .sort(SORT_MAP[sort] ?? SORT_MAP.popular)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  findFeatured() {
    return this.productModel
      .find({ isFeatured: true, isArchived: false, isAvailable: true })
      .populate('category', 'name slug')
      .limit(8)
      .exec();
  }

  async findBySlug(slug: string) {
    const product = await this.productModel
      .findOne({ slug })
      .populate('category');
    if (!product) throw new NotFoundException('Produit introuvable');
    return product;
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id).populate('category');
    if (!product) throw new NotFoundException('Produit introuvable');
    return product;
  }

  // Normalise category en ObjectId (le front l'envoie en string)
  private normalizeCategory<T extends Record<string, unknown>>(data: T): T {
    if (data.category && isValidObjectId(data.category)) {
      return { ...data, category: new Types.ObjectId(data.category as string) };
    }
    return data;
  }

  async create(data: Partial<Product>) {
    const slug = this.toSlug(data.name ?? '');
    return this.productModel.create(this.normalizeCategory({ ...data, slug }));
  }

  async update(id: string, data: Partial<Product>) {
    const product = await this.productModel
      .findByIdAndUpdate(id, { $set: this.normalizeCategory({ ...data }) }, { new: true })
      .populate('category');
    if (!product) throw new NotFoundException('Produit introuvable');
    return product;
  }

  async archive(id: string) {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true },
    );
    if (!product) throw new NotFoundException('Produit introuvable');
    return product;
  }

  async updateRating(productId: string, newRating: number) {
    const product = await this.productModel.findById(productId);
    if (!product) return;
    const { average, count } = product.ratings;
    product.ratings.average = (average * count + newRating) / (count + 1);
    product.ratings.count = count + 1;
    return product.save();
  }

  private toSlug(name: string) {
    return (
      name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
      '-' +
      Date.now()
    );
  }
}
