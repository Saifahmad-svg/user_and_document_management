import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;
}

export class UpdateDocumentDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;
}

export class PaginatedDocumentDto {
  @IsString()
  limit: number;

  @IsString()
  page: number;
}
