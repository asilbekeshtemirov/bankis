import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTranslationDto {
  @ApiPropertyOptional({ example: 'welcome' })
  @IsOptional()
  @IsString()
  key?: string;

  @ApiPropertyOptional({ example: 'Welcome to BankIS!' })
  @IsOptional()
  @IsString()
  value?: string;
}
