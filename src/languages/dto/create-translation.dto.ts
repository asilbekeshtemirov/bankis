import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTranslationDto {
  @ApiProperty({ example: 'en' })
  @IsString()
  languageCode: string;

  @ApiProperty({ example: 'welcome' })
  @IsString()
  key: string;

  @ApiProperty({ example: 'Xush kelibsiz' })
  @IsString()
  value: string;
}
