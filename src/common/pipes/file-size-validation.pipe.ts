import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  constructor(private readonly maxSize: number) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      return value;
    }

    if (value.size > this.maxSize) {
      throw new BadRequestException(`File size exceeds ${this.maxSize} bytes`);
    }

    return value;
  }
}