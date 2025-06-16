import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class FileTypeValidationPipe implements PipeTransform {
    private readonly allowedTypes;
    constructor(allowedTypes: string[]);
    transform(value: any, metadata: ArgumentMetadata): any;
}
