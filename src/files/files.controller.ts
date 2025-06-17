import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { FileSizeValidationPipe } from '../common/pipes/file-size-validation.pipe';
import { FileTypeValidationPipe } from '../common/pipes/file-type-validation.pipe';

@ApiTags('files')
@Controller({ path: 'files', version: '1' })
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  async uploadFile(
    @UploadedFile(
      new FileSizeValidationPipe(5 * 1024 * 1024),
      new FileTypeValidationPipe(['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf'])
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const filePath = await this.filesService.uploadFile(file);
    
    return {
      message: 'File uploaded successfully',
      filePath,
      fileType: this.filesService.getFileTypeFromMimetype(file.mimetype),
      originalName: file.originalname,
      size: file.size,
    };
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  async uploadMultipleFiles(
    @UploadedFiles(
      new FileSizeValidationPipe(5 * 1024 * 1024), 
      new FileTypeValidationPipe(['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf'])
    )
    files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files are required');
    }

    const filePaths = await this.filesService.uploadMultipleFiles(files);
    
    return {
      message: 'Files uploaded successfully',
      files: files.map((file, index) => ({
        filePath: filePaths[index],
        fileType: this.filesService.getFileTypeFromMimetype(file.mimetype),
        originalName: file.originalname,
        size: file.size,
      })),
    };
  }
}