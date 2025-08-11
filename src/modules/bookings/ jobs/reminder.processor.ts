import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { BookingsService } from '../bookings.service';

@Processor('reminders')
@Injectable()
export class ReminderProcessor {
  private readonly logger = new Logger(ReminderProcessor.name);
  constructor(private readonly bookingsService: BookingsService) {}

  @Process('send-reminder')
  async handleReminder(job: Job<{ bookingId: string }>) {
    const { bookingId } = job.data;
    // For demonstration we just log the reminder. In real code, send email/SMS.
    const booking = await this.bookingsService.findById(bookingId);
    if (booking) {
      this.logger.log(
        `Reminder: Booking ${booking.id} for provider ${booking.providerId} starting at ${booking.startsAt.toISOString()}`,
      );
      // TODO: integrate with email/SMS provider
    } else {
      this.logger.warn(`Booking with ID ${bookingId} not found for reminder.`);
    }
  }
}