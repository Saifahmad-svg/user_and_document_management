import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  PaginatedDocumentDto,
} from './dto/documents.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@UseGuards(AuthGuard('jwt'))
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  /**
   * Save the file and trigger the create ingestion function which leads to save
   *  an entry to ingestion repository and trigger kafka to start ingestion process.
   *
   * @authentication JWT (Authorization: Bearer <token>)
   * @form-data file - The path of file.
   * @form-data title - Title of file.
   * @form-data description - Description of file.
   * @returns A response containing document metadata with document id.
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '../uploads/',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${uuid()}${ext}`);
        },
      }),
    })
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreateDocumentDto,
    @Request() req
  ) {
    return this.documentsService.create(createDto, file, req.user.userId);
  }

  /**
   * Retrieves all documents with pagination.
   *
   * @authentication JWT (Authorization: Bearer <token>)
   * @param page - The page number (1-based index, default: 1).
   * @param limit - The number of records per page (default: 10).
   * @returns A paginated response containing documents and metadata.
   */
  @Get()
  findAll(@Query() query: PaginatedDocumentDto) {
    // Fetch paginated documents from the documents service.
    return this.documentsService.findAll(query.page, query.limit);
  }

  /**
   * Retrieves the particular document for a specific id.
   *
   * @authentication JWT (Authorization: Bearer <token>)
   * @param id - The unique identifier of the document.
   * @returns A response containing the particular document and metadata.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    // Fetch a particular document from the documents service.
    return this.documentsService.findOne(id);
  }

  /**
   * Update the particular document for a specific id.
   *
   * @authentication JWT (Authorization: Bearer <token>)
   * @param id - The unique identifier of the document.
   * @returns A response with the status of document updated.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateDocumentDto) {
    // Update the particular document.
    return this.documentsService.update(id, updateDto);
  }

  /**
   * Remove the particular document for a specific id.
   *
   * @authentication JWT (Authorization: Bearer <token>)
   * @param id - The unique identifier of the document.
   * @returns A response with the status of document removed.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    // Remove the particular document
    return this.documentsService.remove(id);
  }
}
