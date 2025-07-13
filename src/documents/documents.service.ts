import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './documents.entity';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/documents.dto';
import { IngestionService } from '../ingestion/ingestion.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepo: Repository<Document>,
    private readonly ingestionService: IngestionService
  ) {}

  async create(
    createDto: CreateDocumentDto,
    file: Express.Multer.File,
    userId: string
  ) {
    const document = this.documentRepo.create({
      ...createDto,
      filePath: file.path,
      uploadedBy: { id: userId },
    });
    // Saving document into document repo
    const savedDocs = await this.documentRepo.save(document);
    // Trigerring Ingest Service
    await this.ingestionService.triggerIngestion(savedDocs.id);
    return savedDocs;
  }

  findAll(page: number = 1, limit: number = 10) {
    // Ensure page and limit are positive integers to prevent invalid queries.
    const pageNumber = Math.max(1, page);
    const pageSize = Math.max(1, limit);

    // Calculate the number of records to skip based on the page number.
    const skip = (pageNumber - 1) * pageSize;

    // Retriving documents with pagination
    return this.documentRepo.find({
      relations: ['uploadedBy'],
      skip,
      take: pageSize,
    });
  }

  async findOne(id: string) {
    // Retriving particular document
    const doc = await this.documentRepo.findOne({
      where: { id },
      relations: ['uploadedBy'],
    });
    // Throw an error if document not found
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async update(id: string, updateDto: UpdateDocumentDto) {
    // Retriving particular document
    const doc = await this.findOne(id);
    Object.assign(doc, updateDto);
    // Updating that document
    return this.documentRepo.save(doc);
  }

  async remove(id: string) {
    // Fetching particular document
    const doc = await this.findOne(id);
    // Removing that document
    return this.documentRepo.remove(doc);
  }
}
