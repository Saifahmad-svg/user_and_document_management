import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Document } from './../documents/documents.entity';

export enum IngestionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('ingestions')
export class Ingestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Document, { eager: true })
  document: Document;

  @Column({
    type: 'enum',
    enum: IngestionStatus,
    default: IngestionStatus.PENDING,
  })
  status: IngestionStatus;

  @Column({ type: 'text', nullable: true })
  log: string;

  @CreateDateColumn()
  createdAt: Date;
}
