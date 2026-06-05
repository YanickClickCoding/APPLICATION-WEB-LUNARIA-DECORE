import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import {
  DecorationService,
  DecorationServiceSchema,
} from '../common/schemas/decoration-service.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DecorationService.name, schema: DecorationServiceSchema },
    ]),
    AuthModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService, MongooseModule],
})
export class ServicesModule {}
