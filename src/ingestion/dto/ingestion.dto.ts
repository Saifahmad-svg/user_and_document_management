import { IsUUID } from 'class-validator';

export class TriggerIngestionDto {
  @IsUUID()
  documentId: string;
}
