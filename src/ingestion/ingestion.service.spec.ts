import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ingestion } from './ingestion.entity';
import { Document } from '../documents/documents.entity';
import { KafkaService } from '../kafka/kafka.service';

const mockInjestionRepository = {
  find: jest.fn(),
  save: jest.fn(),
  // Add more mocked methods as needed
};
const mockDocumentRepository = {
  find: jest.fn(),
  save: jest.fn(),
  // Add more mocked methods as needed
};

describe('IngestionService', () => {
  let service: IngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        KafkaService,
        {
          provide: getRepositoryToken(Ingestion),
          useValue: mockInjestionRepository,
        },
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
