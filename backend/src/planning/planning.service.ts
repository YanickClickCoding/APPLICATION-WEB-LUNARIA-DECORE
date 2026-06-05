import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DecorationPlanning,
  PlanningDocument,
} from '../common/schemas/planning.schema';

@Injectable()
export class PlanningService {
  constructor(
    @InjectModel(DecorationPlanning.name)
    private planningModel: Model<PlanningDocument>,
  ) {}

  async create(userId: string, data: object) {
    const planningNumber = `PLAN-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    return this.planningModel.create({
      ...data,
      client: userId,
      planningNumber,
      statusHistory: [{ status: 'EN_ATTENTE', date: new Date() }],
    });
  }

  async findByClient(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await this.planningModel.countDocuments({ client: userId });
    const data = await this.planningModel
      .find({ client: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('service', 'name images basePrice')
      .exec();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAll(page = 1, limit = 20, status?: string) {
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    const total = await this.planningModel.countDocuments(query);
    const data = await this.planningModel
      .find(query)
      .sort({ eventDate: 1 })
      .skip(skip)
      .limit(limit)
      .populate('client', 'firstName lastName phone')
      .populate('service', 'name')
      .exec();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string, userId?: string) {
    const planning = await this.planningModel
      .findById(id)
      .populate('client', 'firstName lastName phone email')
      .populate('service');
    if (!planning) throw new NotFoundException('Planification introuvable');
    if (userId && String(planning.client['_id']) !== userId)
      throw new ForbiddenException();
    return planning;
  }

  async getAvailableSlots(date?: string) {
    // Retourne les créneaux disponibles (logique simplifiée)
    const slots = [
      '08:00 - 10:00',
      '10:00 - 12:00',
      '14:00 - 16:00',
      '16:00 - 18:00',
      '18:00 - 20:00',
    ];
    if (!date) return { slots };

    const taken = await this.planningModel
      .find({
        $or: [
          { 'visitSlot.date': new Date(date) },
          { 'installationSlot.date': new Date(date) },
        ],
      })
      .select('visitSlot installationSlot');

    const takenSlots = taken
      .flatMap((p) => [p.visitSlot?.timeSlot, p.installationSlot?.timeSlot])
      .filter(Boolean);

    return { slots: slots.filter((s) => !takenSlots.includes(s)), date };
  }

  async sendQuote(
    id: string,
    quoteData: { amount: number; description: string; validDays?: number },
  ) {
    const planning = await this.planningModel.findById(id);
    if (!planning) throw new NotFoundException();

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + (quoteData.validDays ?? 5));

    planning.quote = {
      ...quoteData,
      validUntil,
      sentAt: new Date(),
      respondedAt: undefined,
    };
    planning.status = 'DEVIS_ENVOYE';
    planning.statusHistory.push({
      status: 'DEVIS_ENVOYE',
      date: new Date(),
    });
    return planning.save();
  }

  async respondToQuote(id: string, userId: string, accept: boolean) {
    const planning = await this.planningModel.findById(id);
    if (!planning) throw new NotFoundException();
    if (String(planning.client) !== userId) throw new ForbiddenException();
    if (planning.status !== 'DEVIS_ENVOYE')
      throw new BadRequestException('Aucun devis en attente');

    const newStatus = accept ? 'DEVIS_ACCEPTE' : 'DEVIS_REFUSE';
    planning.status = newStatus;
    if (planning.quote) planning.quote.respondedAt = new Date();
    planning.statusHistory.push({
      status: newStatus,
      date: new Date(),
    });
    return planning.save();
  }

  async updateStatus(id: string, status: string, note?: string) {
    const planning = await this.planningModel.findById(id);
    if (!planning) throw new NotFoundException();
    planning.status = status;
    planning.statusHistory.push({ status, date: new Date(), note });
    return planning.save();
  }
}
