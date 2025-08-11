import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './modules/auth/auth.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { Booking } from './modules/bookings/entities/booking.entity';
import { HealthModule } from './modules/health/health.module';
import { User } from './modules/users/user.entity';


@Module({
  imports: [
    // Database connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5112),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'bookings',
      entities: [Booking, User],
      // synchronize is enabled here for simplicity so that tables are created automatically.
      synchronize: true,
    }),
    // Redis Bull queue connection
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: +(process.env.REDIS_PORT || 6379),
      },
    }),
    BookingsModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}