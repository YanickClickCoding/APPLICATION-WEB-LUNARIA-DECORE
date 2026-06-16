import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Get('movements')
  movements(@Query('product') product?: string) {
    return this.stockService.findMovements(product);
  }

  @Get('low')
  lowStock() {
    return this.stockService.findLowStock();
  }

  @Post('movements')
  createMovement(@Body() data: any) {
    return this.stockService.createMovement(data);
  }
}
