import { PartialType } from '@nestjs/swagger';
import { CreateLanguageDto } from './create-language.dto';
import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLanguageDto extends PartialType(CreateLanguageDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}