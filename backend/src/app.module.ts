import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '@common/prisma/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { ClientsModule } from '@modules/clients/clients.module';
import { LawyersModule } from '@modules/lawyers/lawyers.module';
import { ConsultationsModule } from '@modules/consultations/consultations.module';
import { OrdersModule } from '@modules/orders/orders.module';
import { PaymentsModule } from '@modules/payments/payments.module';
import { MessagesModule } from '@modules/messages/messages.module';
import { ReviewsModule } from '@modules/reviews/reviews.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { AdminModule } from '@modules/admin/admin.module';
import { AuditModule } from '@modules/audit/audit.module';
import { StorageModule } from '@modules/storage/storage.module';
import { AIModule } from '@modules/ai/ai.module';
import { DatabaseConfig } from '@config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [DatabaseConfig],
      cache: true,
      expandVariables: true,
    }),

    // Database
    PrismaModule,

    // Core Modules
    AuthModule,
    UsersModule,
    ClientsModule,
    LawyersModule,
    ConsultationsModule,
    OrdersModule,
    PaymentsModule,
    MessagesModule,
    ReviewsModule,
    NotificationsModule,
    AdminModule,
    AuditModule,
    StorageModule,
    AIModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
