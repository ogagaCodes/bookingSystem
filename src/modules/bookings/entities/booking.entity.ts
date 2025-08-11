import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceType } from '../enums/service-type.enum';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'provider_id' })
  providerId!: string;

  @Column({ name: 'client_name', length: 80 })
  clientName!: string;

  @Column({ name: 'client_phone' })
  clientPhone!: string;

  @Column({ type: 'enum', enum: ServiceType })
  service!: ServiceType;

  @Column({ name: 'starts_at', type: 'timestamp with time zone' })
  startsAt!: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}