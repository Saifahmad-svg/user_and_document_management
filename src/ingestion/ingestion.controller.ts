import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { AuthGuard } from '@nestjs/passport';
import { PaginatedIngestionDto } from './dto/ingestion.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Get(':docId/status')
  getStatus(@Param('docId') docId: string) {
    return this.ingestionService.getIngestionStatus(docId);
  }

  @Get('history')
  getHistory(@Query() query: PaginatedIngestionDto) {
    return this.ingestionService.getIngestionHistory(query.page, query.limit);
  }
}
