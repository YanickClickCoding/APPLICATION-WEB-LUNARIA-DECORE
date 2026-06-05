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
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../common/schemas/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(@CurrentUser() user: UserDocument, @Body() body: object) {
    return this.ordersService.create({
      ...body,
      userId: String(user._id),
    } as never);
  }

  @Get()
  findMine(
    @CurrentUser() user: UserDocument,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.ordersService.findByClient(String(user._id), page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    const userId = user.role === 'ADMIN' ? undefined : String(user._id);
    return this.ordersService.findById(id, userId);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.ordersService.cancel(id, String(user._id));
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
    return this.ordersService.findAll(page, limit, status);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('note') note: string,
  ) {
    return this.ordersService.updateStatus(id, status, note);
  }
}
