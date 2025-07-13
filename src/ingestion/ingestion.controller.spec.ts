import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from '../ingestion/ingestion.service';
import { Ingestion } from './ingestion.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../documents/documents.entity';
import { KafkaService } from '../kafka/kafka.service';

const mockIngestionRepository = {
  find: jest.fn(),
  save: jest.fn(),
  // Add more mocked methods as needed
};

const mockDocumentRepository = {
  find: jest.fn(),
  save: jest.fn(),
  // Add more mocked methods as needed
};

describe('IngestionController', () => {
  let controller: IngestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        IngestionService,
        KafkaService,
        {
          provide: getRepositoryToken(Ingestion),
          useValue: mockIngestionRepository,
        },
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
