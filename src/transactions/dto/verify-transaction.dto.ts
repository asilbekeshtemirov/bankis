import { IsString, IsEmail, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTransactionDto {
  @ApiProperty()
  @IsUUID()
  transactionId: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  verificationCode: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}