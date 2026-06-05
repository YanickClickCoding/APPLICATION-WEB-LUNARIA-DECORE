import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../common/schemas/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('delivery')
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  // ─── Livreur ──────────────────────────────────────────────────
  @UseGuards(RolesGuard)
  @Roles('LIVREUR', 'ADMIN')
  @Get('my')
  myDeliveries(@CurrentUser() user: UserDocument) {
    return this.deliveryService.findByLivreur(String(user._id));
  }

  @UseGuards(RolesGuard)
  @Roles('LIVREUR', 'ADMIN')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
    @Body('status') status: string,
    @Body('note') note: string,
  ) {
    const userId = user.role === 'ADMIN' ? undefined : String(user._id);
    return this.deliveryService.updateStatus(id, status, note, userId);
  }

  // ─── Client ───────────────────────────────────────────────────
  @Post('confirm/:orderId')
  confirmReception(@Param('orderId') orderId: string) {
    return this.deliveryService.confirmReception(orderId);
  }

  // ─── Admin ────────────────────────────────────────────────────
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status: string,
  ) {
    return this.deliveryService.findAll(page, limit, status);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryService.findById(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post(':id/assign')
  assign(@Param('id') id: string, @Body('livreurId') livreurId: string) {
    return this.deliveryService.assignLivreur(id, livreurId);
  }
}
