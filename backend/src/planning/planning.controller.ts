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
import { PlanningService } from './planning.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../common/schemas/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('planning')
export class PlanningController {
  constructor(private planningService: PlanningService) {}

  @Post()
  create(@CurrentUser() user: UserDocument, @Body() body: object) {
    return this.planningService.create(String(user._id), body);
  }

  @Get()
  findMine(
    @CurrentUser() user: UserDocument,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.planningService.findByClient(String(user._id), page, limit);
  }

  @Get('slots')
  getSlots(@Query('date') date: string) {
    return this.planningService.getAvailableSlots(date);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    const userId = user.role === 'ADMIN' ? undefined : String(user._id);
    return this.planningService.findById(id, userId);
  }

  @Patch(':id/accept')
  acceptQuote(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.planningService.respondToQuote(id, String(user._id), true);
  }

  @Patch(':id/reject')
  rejectQuote(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.planningService.respondToQuote(id, String(user._id), false);
  }

  // ─── Admin ────────────────────────────────────────────────────
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get('admin/all')
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status: string,
  ) {
    return this.planningService.findAll(page, limit, status);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post(':id/quote')
  sendQuote(
    @Param('id') id: string,
    @Body() body: { amount: number; description: string; validDays?: number },
  ) {
    return this.planningService.sendQuote(id, body);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('note') note: string,
  ) {
    return this.planningService.updateStatus(id, status, note);
  }
}
