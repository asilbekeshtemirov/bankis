import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLanguageDto {
  @ApiProperty({ example: 'uz' })
  @IsString()
  @Length(2, 5)
  code: string;

  @ApiProperty({ example: 'O\'zbekcha' })
  @IsString()
  @Length(1, 100)
  name: string;
}