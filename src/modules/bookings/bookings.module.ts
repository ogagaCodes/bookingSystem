import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Booking } from './entities/booking.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingEventsGateway } from './event/booking-events.gateway';
import { ReminderProcessor } from './ jobs/reminder.processor';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    // Register a Bull queue for reminders
    BullModule.registerQueue({
      name: 'reminders',
    }),
    AuthModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService, BookingEventsGateway, ReminderProcessor],
  exports: [BookingsService],
})
export class BookingsModule {}