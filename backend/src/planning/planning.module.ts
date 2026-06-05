import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanningController } from './planning.controller';
import { PlanningService } from './planning.service';
import {
  DecorationPlanning,
  PlanningSchema,
} from '../common/schemas/planning.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DecorationPlanning.name, schema: PlanningSchema },
    ]),
    AuthModule,
  ],
  controllers: [PlanningController],
  providers: [PlanningService],
  exports: [PlanningService],
})
export class PlanningModule {}
