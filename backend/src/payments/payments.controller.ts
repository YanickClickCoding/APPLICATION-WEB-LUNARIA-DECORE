import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../common/schemas/user.schema';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('mtn-momo/initiate')
  initiateMtn(@CurrentUser() user: UserDocument, @Body() body: object) {
    return this.paymentsService.initiateMtnMomo({
      ...body,
      userId: String(user._id),
    } as never);
  }

  @UseGuards(JwtAuthGuard)
  @Post('moov/initiate')
  initiateMoov(@CurrentUser() user: UserDocument, @Body() body: object) {
    return this.paymentsService.initiateMoovMoney({
      ...body,
      userId: String(user._id),
    } as never);
  }

  // Webhooks (publics — appelés par MTN/Moov)
  @Post('mtn-momo/callback')
  mtnCallback(
    @Body()
    body: {
      externalId: string;
      status: string;
      financialTransactionId?: string;
    },
  ) {
    return this.paymentsService.handleCallback(
      body.externalId,
      body.status as 'SUCCESSFUL' | 'FAILED',
      body.financialTransactionId,
    );
  }

  @Post('moov/callback')
  moovCallback(
    @Body() body: { reference: string; status: string; transactionId?: string },
  ) {
    return this.paymentsService.handleCallback(
      body.reference,
      body.status === 'SUCCESS' ? 'SUCCESSFUL' : 'FAILED',
      body.transactionId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  history(@CurrentUser() user: UserDocument) {
    return this.paymentsService.getHistory(String(user._id));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.paymentsService.getById(id);
  }
}
