import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { Supplier, SupplierSchema } from '../common/schemas/supplier.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
    ]),
    AuthModule,
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService, MongooseModule],
})
export class SuppliersModule {}
