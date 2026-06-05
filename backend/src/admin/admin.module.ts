import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from '../common/schemas/user.schema';
import { Order, OrderSchema } from '../common/schemas/order.schema';
import { Payment, PaymentSchema } from '../common/schemas/payment.schema';
import {
  DecorationPlanning,
  PlanningSchema,
} from '../common/schemas/planning.schema';
import {
  Conversation,
  ConversationSchema,
} from '../common/schemas/conversation.schema';
import { Delivery, DeliverySchema } from '../common/schemas/delivery.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: DecorationPlanning.name, schema: PlanningSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: Delivery.name, schema: DeliverySchema },
    ]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
