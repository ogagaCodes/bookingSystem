import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { BookingEventsGateway } from './event/booking-events.gateway';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private readonly repo: Repository<Booking>,
    @InjectQueue('reminders') private readonly reminderQueue: Queue,
    private readonly eventsGateway: BookingEventsGateway,
  ) {}

  /**
   * Create a booking for a provider. Schedules a reminder job and emits
   * a WebSocket event upon creation.
   */
  async create(providerId: string, dto: CreateBookingDto): Promise<Booking> {
    const booking = this.repo.create({
      providerId,
      clientName: dto.clientName,
      clientPhone: dto.clientPhone,
      service: dto.service,
      startsAt: new Date(dto.startsAt),
      notes: dto.notes,
    });
    const saved = await this.repo.save(booking);
    // Calculate delay for 10 minutes before start
    const now = Date.now();
    const startMs = new Date(dto.startsAt).getTime();
    const reminderTime = startMs - 10 * 60 * 1000;
    const delay = Math.max(reminderTime - now, 0);
    // Add a job to send reminder
    await this.reminderQueue.add(
      'send-reminder',
      { bookingId: saved.id },
      { delay },
    );
    // Emit WebSocket event
    this.eventsGateway.bookingCreated(saved);
    return saved;
  }

  /**
   * Find a booking by its id. Optionally ensure provider ownership if
   * providerId is specified.
   */
  async findById(id: string, providerId?: string): Promise<Booking | null> {
    const where: any = { id };
    if (providerId) {
      where.providerId = providerId;
    }
    return this.repo.findOne({ where });
  }

  /**
   * List upcoming or past bookings. If providerId is passed and the caller
   * is not an admin, results are limited to that provider. Pagination
   * is 1-based.
   */
  async list(
    past: boolean,
    page = 1,
    limit = 10,
    providerId?: string,
  ): Promise<{ data: Booking[]; total: number }> {
    const qb = this.repo.createQueryBuilder('b');
    const now = new Date();
    if (past) {
      qb.andWhere('b.startsAt < :now', { now });
    } else {
      qb.andWhere('b.startsAt >= :now', { now });
    }
    if (providerId) {
      qb.andWhere('b.providerId = :providerId', { providerId });
    }
    qb.orderBy('b.startsAt', past ? 'DESC' : 'ASC');
    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }
}