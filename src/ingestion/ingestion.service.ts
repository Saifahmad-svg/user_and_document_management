import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingestion, IngestionStatus } from './ingestion.entity';
import { Document } from '../documents/documents.entity';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Ingestion)
    private readonly ingestionRepo: Repository<Ingestion>,

    @InjectRepository(Document)
    private readonly docRepo: Repository<Document>,

    private readonly kafkaService: KafkaService
  ) {}

  async triggerIngestion(documentId: string) {
    const doc = await this.docRepo.findOne({ where: { id: documentId } });
    if (!doc) throw new NotFoundException('Document not found');

    // Save initial ingestion record
    const ingestion = this.ingestionRepo.create({
      document: doc,
      status: IngestionStatus.PENDING,
      log: 'Ingestion triggered and message sent to Kafka.',
    });
    const saved = await this.ingestionRepo.save(ingestion);

    // Send Kafka message (includes ingestionId)
    await this.kafkaService.send('documents-topic', {
      ingestionId: saved.id,
      documentId: doc.id,
      filePath: doc.filePath,
    });

    return {
      message: 'Ingestion triggered',
      ingestionId: saved.id,
    };
  }

  async getIngestionStatus(documentId: string) {
    return this.ingestionRepo.find({
      where: { document: { id: documentId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getIngestionHistory(page: number = 1, limit: number = 10) {
    // Ensure page and limit are positive integers to prevent invalid queries.
    const pageNumber = Math.max(1, page);
    const pageSize = Math.max(1, limit);

    // Calculate the number of records to skip based on the page number.
    const skip = (pageNumber - 1) * pageSize;

    return this.ingestionRepo.find({
      order: { createdAt: 'DESC' },
      skip,
      take: pageSize,
    });
  }

  async updateIngestionStatus(
    ingestionId: string,
    status: IngestionStatus,
    log: string
  ) {
    const ingestion = await this.ingestionRepo.findOne({
      where: { id: ingestionId },
    });
    if (!ingestion) throw new NotFoundException('Ingestion not found');

    ingestion.status = status;
    ingestion.log += `\n${log}`;
    return this.ingestionRepo.save(ingestion);
  }
}
