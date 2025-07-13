import { IsUUID, IsString } from 'class-validator';

export class TriggerIngestionDto {
  @IsUUID()
  documentId: string;
}
export class PaginatedIngestionDto {
  @IsString()
  limit: number;

  @IsString()
  page: number;
}
