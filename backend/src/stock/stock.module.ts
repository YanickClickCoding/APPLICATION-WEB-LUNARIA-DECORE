import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import {
  StockMovement,
  StockMovementSchema,
} from '../common/schemas/stock-movement.schema';
import { Product, ProductSchema } from '../common/schemas/product.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StockMovement.name, schema: StockMovementSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    AuthModule,
  ],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
