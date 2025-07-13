import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingestion } from './ingestion.entity';
import { Document } from '../documents/documents.entity';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ingestion, Document]), KafkaModule],
  controllers: [IngestionController],
  providers: [IngestionService],
  exports: [IngestionService, KafkaModule],
})
export class IngestionModule {}
