import { DataSource } from 'typeorm';
import { Booking } from './modules/bookings/entities/booking.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'bookings',
  entities: [Booking],
  migrations: ['migration/*.sql'],
});