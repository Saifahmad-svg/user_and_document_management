import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './documents.entity';
import { IngestionModule } from '../ingestion/ingestion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), IngestionModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService, IngestionModule],
})
export class DocumentsModule {}
