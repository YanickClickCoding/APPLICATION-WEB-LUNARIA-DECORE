import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ServicesModule } from './services/services.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PlanningModule } from './planning/planning.module';
import { PaymentsModule } from './payments/payments.module';
import { DeliveryModule } from './delivery/delivery.module';
import { MessagingModule } from './messaging/messaging.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { PromosModule } from './promos/promos.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    ServicesModule,
    CartModule,
    OrdersModule,
    PlanningModule,
    PaymentsModule,
    DeliveryModule,
    MessagingModule,
    NotificationsModule,
    ReviewsModule,
    UploadModule,
    AdminModule,
    PromosModule,
    SuppliersModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
