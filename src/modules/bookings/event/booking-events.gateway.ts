import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Booking } from '../entities/booking.entity';

@WebSocketGateway({ namespace: 'bookings' })
export class BookingEventsGateway {
  @WebSocketServer()
  server!: Server;

  /**
   * Emits a booking.created event to all connected clients.
   */
  bookingCreated(booking: Booking) {
    if (!this.server) return;
    this.server.emit('booking.created', booking);
  }
}