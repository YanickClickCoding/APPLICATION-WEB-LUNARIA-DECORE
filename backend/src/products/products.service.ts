import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Product, ProductDocument } from '../common/schemas/product.schema';
import {
  Category,
  CategoryDocument,
} from '../common/schemas/category.schema';

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
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  // Résout un slug de catégorie en ObjectId ; renvoie null si déjà un id ou introuvable
  private async resolveCategorySlug(value: string): Promise<Types.ObjectId | null> {
    if (isValidObjectId(value)) return null;
    const cat = await this.categoryModel.findOne({ slug: value }).select('_id');
    return cat ? (cat._id as Types.ObjectId) : null;
  }

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
      // Un produit appartient à plusieurs familles : il matche si la catégorie
      // demandée est sa catégorie principale OU dans son tableau `categories`.
      // Accepte un ObjectId OU un slug (résolu en id ici).
      const resolved = await this.resolveCategorySlug(category);
      if (resolved) {
        // slug → id
        query.$or = [{ category: resolved }, { categories: resolved }];
      } else if (isValidObjectId(category)) {
        const values = [new Types.ObjectId(category), category];
        query.$or = [
          { category: { $in: values } },
          { categories: { $in: values } },
        ];
      } else {
        // slug inconnu → aucun résultat (évite l'erreur de cast)
        query._id = null;
      }
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
      .populate('categories', 'name slug')
      .sort(SORT_MAP[sort] ?? SORT_MAP.popular)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  findFeatured() {
    // Les plus récemment ajoutés/mis en avant d'abord → un produit fraîchement
    // coché « Mis en avant » apparaît tout de suite en page d'accueil.
    return this.productModel
      .find({ isFeatured: true, isArchived: false, isAvailable: true })
      .populate('category', 'name slug')
      .populate('categories', 'name slug')
      .sort({ updatedAt: -1, createdAt: -1 })
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

  // Normalise category + categories[] en ObjectId (le front les envoie en string)
  private normalizeCategory<T extends Record<string, unknown>>(data: T): T {
    const out: Record<string, unknown> = { ...data };
    if (out.category && isValidObjectId(out.category)) {
      out.category = new Types.ObjectId(out.category as string);
    }
    if (Array.isArray(out.categories)) {
      const ids = (out.categories as unknown[])
        .filter((c) => isValidObjectId(c as string))
        .map((c) => new Types.ObjectId(c as string));
      out.categories = ids;
      // garantit que la catégorie principale fait partie des familles
      if (out.category && !ids.some((x) => x.equals(out.category as Types.ObjectId))) {
        out.categories = [out.category as Types.ObjectId, ...ids];
      }
    }
    return out as T;
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
