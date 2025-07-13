import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../documents/documents.entity';
import { IngestionService } from '../ingestion/ingestion.service';
import { Ingestion } from '../ingestion/ingestion.entity';
import { KafkaService } from '../kafka/kafka.service';
const mockDocumentRepository = {
  find: jest.fn(),
  save: jest.fn(),
};
const mockInjestionRepository = {
  find: jest.fn(),
  save: jest.fn(),
};

describe('DocumentsService', () => {
  let service: DocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        KafkaService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
        {
          provide: getRepositoryToken(Ingestion),
          useValue: mockInjestionRepository,
        },
        IngestionService,
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
