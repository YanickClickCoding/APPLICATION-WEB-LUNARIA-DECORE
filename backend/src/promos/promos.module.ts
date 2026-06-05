import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromosController } from './promos.controller';
import { PromosService } from './promos.service';
import { PromoCode, PromoCodeSchema } from '../common/schemas/promo.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromoCode.name, schema: PromoCodeSchema },
    ]),
    AuthModule,
  ],
  controllers: [PromosController],
  providers: [PromosService],
  exports: [PromosService],
})
export class PromosModule {}
