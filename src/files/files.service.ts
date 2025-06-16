import { Injectable, BadRequestException } from '@nestjs/common';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly uploadPath = join(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadDirectories();
  }

  private ensureUploadDirectories() {
    const directories = ['images', 'videos', 'documents'];
    
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }

    directories.forEach(dir => {
      const dirPath = join(this.uploadPath, dir);
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    let subDirectory = 'documents';
    
    if (file.mimetype.startsWith('image/')) {
      subDirectory = 'images';
    } else if (file.mimetype.startsWith('video/')) {
      subDirectory = 'videos';
    }

    const filePath = join(this.uploadPath, subDirectory, fileName);
    
    try {
      writeFileSync(filePath, file.buffer);
      return `/uploads/${subDirectory}/${fileName}`;
    } catch (error) {
      throw new BadRequestException('Failed to save file');
    }
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map(file => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  getFileTypeFromMimetype(mimetype: string): string {
    if (mimetype.startsWith('image/')) {
      return 'image';
    } else if (mimetype.startsWith('video/')) {
      return 'video';
    } else {
      return 'document';
    }
  }
}