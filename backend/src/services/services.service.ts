import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DecorationService,
  DecorationServiceDocument,
} from '../common/schemas/decoration-service.schema';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(DecorationService.name)
    private serviceModel: Model<DecorationServiceDocument>,
  ) {}

  findAll() {
    return this.serviceModel
      .find({ isArchived: false, isAvailable: true })
      .populate('category', 'name slug')
      .sort({ isFeatured: -1, createdAt: -1 })
      .exec();
  }

  findFeatured() {
    return this.serviceModel
      .find({ isFeatured: true, isArchived: false })
      .populate('category', 'name slug')
      .limit(6)
      .exec();
  }

  async findBySlug(slug: string) {
    const service = await this.serviceModel
      .findOne({ slug })
      .populate('category');
    if (!service) throw new NotFoundException('Service introuvable');
    return service;
  }

  async findById(id: string) {
    const service = await this.serviceModel.findById(id).populate('category');
    if (!service) throw new NotFoundException('Service introuvable');
    return service;
  }

  async create(data: Partial<DecorationService>) {
    const slug = this.toSlug(data.name ?? '') + '-' + Date.now();
    return this.serviceModel.create({ ...data, slug });
  }

  async update(id: string, data: Partial<DecorationService>) {
    const service = await this.serviceModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .populate('category');
    if (!service) throw new NotFoundException();
    return service;
  }

  async archive(id: string) {
    const s = await this.serviceModel.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true },
    );
    if (!s) throw new NotFoundException();
    return s;
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
