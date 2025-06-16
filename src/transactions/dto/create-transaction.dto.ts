import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: '8600123456789012' })
  @IsString()
  fromAccountNumber: string;

  @ApiProperty({ example: '8600987654321098' })
  @IsString()
  toAccountNumber: string;

  @ApiProperty({ example: 50000, minimum: 1 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiPropertyOptional({ example: 'Payment for services' })
  @IsOptional()
  @IsString()
  description?: string;
}