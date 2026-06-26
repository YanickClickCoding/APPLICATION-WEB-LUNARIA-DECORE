import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from '../common/schemas/cart.schema';
import { Product, ProductSchema } from '../common/schemas/product.schema';
import {
  DecorationService,
  DecorationServiceSchema,
} from '../common/schemas/decoration-service.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
      { name: DecorationService.name, schema: DecorationServiceSchema },
    ]),
    AuthModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
