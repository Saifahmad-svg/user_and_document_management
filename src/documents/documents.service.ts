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
    const savedDocs = await this.documentRepo.save(document);
    // Triger Ingest
    await this.ingestionService.triggerIngestion(savedDocs.id);
    return savedDocs;
  }

  findAll() {
    return this.documentRepo.find({ relations: ['uploadedBy'] });
  }

  async findOne(id: string) {
    const doc = await this.documentRepo.findOne({
      where: { id },
      relations: ['uploadedBy'],
    });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async update(id: string, updateDto: UpdateDocumentDto) {
    const doc = await this.findOne(id);
    Object.assign(doc, updateDto);
    return this.documentRepo.save(doc);
  }

  async remove(id: string) {
    const doc = await this.findOne(id);
    return this.documentRepo.remove(doc);
  }
}
