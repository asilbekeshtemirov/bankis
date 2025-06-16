import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  constructor(private readonly allowedTypes: string[]) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      return value;
    }

    if (!this.allowedTypes.includes(value.mimetype)) {
      throw new BadRequestException(`File type ${value.mimetype} is not allowed`);
    }

    return value;
  }
}