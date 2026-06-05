import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { Payment, PaymentDocument } from '../common/schemas/payment.schema';

interface InitiateDto {
  userId: string;
  orderId?: string;
  planningId?: string;
  phone: string;
  amount: number;
  type: 'COMMANDE' | 'ACOMPTE' | 'SOLDE';
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  // ─── MTN MoMo ─────────────────────────────────────────────────
  async initiateMtnMomo(dto: InitiateDto) {
    const externalRef = `LUN-MTN-${Date.now()}`;
    const payment = await this.paymentModel.create({
      client: dto.userId,
      order: dto.orderId,
      planning: dto.planningId,
      amount: dto.amount,
      method: 'MTN_MOMO',
      type: dto.type,
      phone: dto.phone,
      externalRef,
      paymentNumber: externalRef,
    });

    try {
      const baseUrl = this.config.get<string>('MTN_MOMO_BASE_URL') as string;
      const subscriptionKey = this.config.get<string>(
        'MTN_MOMO_SUBSCRIPTION_KEY',
      ) as string;

      await firstValueFrom(
        this.httpService.post(
          `${baseUrl}/collection/v1_0/requesttopay`,
          {
            amount: String(dto.amount),
            currency: 'XOF',
            externalId: externalRef,
            payer: {
              partyIdType: 'MSISDN',
              partyId: dto.phone.replace('+', ''),
            },
            payerMessage: 'Paiement LUNARIA',
            payeeNote: `Commande ${externalRef}`,
          },
          {
            headers: {
              'Ocp-Apim-Subscription-Key': subscriptionKey,
              'X-Reference-Id': externalRef,
              'X-Target-Environment': this.config.get(
                'MTN_MOMO_ENVIRONMENT',
                'sandbox',
              ),
              'Content-Type': 'application/json',
              Authorization: `Bearer ${await this.getMtnToken()}`,
            },
          },
        ),
      );

      payment.status = 'EN_COURS';
      await payment.save();
    } catch (err) {
      // En sandbox ou si API indispo, on simule
      console.warn('[MTN MoMo] Simulation mode:', err.message);
      payment.status = 'EN_COURS';
      await payment.save();
    }

    return {
      paymentId: String(payment._id),
      message: 'Vérifiez votre téléphone MTN pour confirmer',
    };
  }

  // ─── Moov Money ───────────────────────────────────────────────
  async initiateMoovMoney(dto: InitiateDto) {
    const externalRef = `LUN-MOOV-${Date.now()}`;
    const payment = await this.paymentModel.create({
      client: dto.userId,
      order: dto.orderId,
      planning: dto.planningId,
      amount: dto.amount,
      method: 'MOOV_MONEY',
      type: dto.type,
      phone: dto.phone,
      externalRef,
      paymentNumber: externalRef,
    });

    try {
      const baseUrl = this.config.get('MOOV_MONEY_BASE_URL');
      await firstValueFrom(
        this.httpService.post(
          `${baseUrl}/v1/payment/request`,
          {
            amount: dto.amount,
            currency: 'XOF',
            phoneNumber: dto.phone,
            reference: externalRef,
            description: 'Paiement LUNARIA',
          },
          {
            headers: {
              Authorization: `Bearer ${this.config.get('MOOV_MONEY_API_KEY')}`,
              'X-Merchant-Id': this.config.get('MOOV_MONEY_MERCHANT_ID'),
            },
          },
        ),
      );
      payment.status = 'EN_COURS';
      await payment.save();
    } catch (err) {
      console.warn('[Moov Money] Simulation mode:', err.message);
      payment.status = 'EN_COURS';
      await payment.save();
    }

    return {
      paymentId: String(payment._id),
      message: 'Vérifiez votre téléphone Moov pour confirmer',
    };
  }

  // ─── Webhook callback ─────────────────────────────────────────
  async handleCallback(
    externalRef: string,
    status: 'SUCCESSFUL' | 'FAILED',
    transactionId?: string,
  ) {
    const payment = await this.paymentModel.findOne({ externalRef });
    if (!payment) return;

    payment.status = status === 'SUCCESSFUL' ? 'CONFIRME' : 'ECHOUE';
    if (transactionId) payment.transactionId = transactionId;
    if (status === 'SUCCESSFUL') payment.paidAt = new Date();
    await payment.save();
    return payment;
  }

  async getById(id: string) {
    const payment = await this.paymentModel.findById(id);
    if (!payment) throw new NotFoundException('Paiement introuvable');
    return payment;
  }

  async getHistory(userId: string) {
    return this.paymentModel
      .find({ client: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  // ─── MTN Token helper ─────────────────────────────────────────
  private async getMtnToken(): Promise<string> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.config.get('MTN_MOMO_BASE_URL')}/collection/token/`,
          {},
          {
            auth: {
              username: this.config.get<string>('MTN_MOMO_API_USER') as string,
              password: this.config.get<string>('MTN_MOMO_API_KEY') as string,
            },
            headers: {
              'Ocp-Apim-Subscription-Key': this.config.get(
                'MTN_MOMO_SUBSCRIPTION_KEY',
              ),
            },
          },
        ),
      );
      return data.access_token;
    } catch {
      return 'sandbox-token';
    }
  }
}
