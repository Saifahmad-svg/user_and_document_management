import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Get(':docId/status')
  getStatus(@Param('docId') docId: string) {
    return this.ingestionService.getIngestionStatus(docId);
  }

  @Get('history')
  getHistory() {
    return this.ingestionService.getIngestionHistory();
  }
}
