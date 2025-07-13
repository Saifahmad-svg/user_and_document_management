import { Module, forwardRef } from '@nestjs/common';
import { KafkaService } from './kafka.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionModule } from '../ingestion/ingestion.module';
// import { Ingestion } from '../ingestion/ingestion.entity';

@Module({
  imports: [forwardRef(() => IngestionModule)],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
