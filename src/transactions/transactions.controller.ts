import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, VerifyTransactionDto } from './dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TransactionStatus, TransactionType } from '@prisma/client';

@ApiTags('transactions')
@Controller({ path: 'transactions', version: '1' })
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  create(@CurrentUser() user: any, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(user.sub, createTransactionDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify transaction with code' })
  @ApiResponse({ status: 200, description: 'Transaction verified successfully' })
  verifyTransaction(@Body() verifyTransactionDto: VerifyTransactionDto) {
    return this.transactionsService.verifyTransaction(verifyTransactionDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get all transactions (Admin/Manager only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: TransactionStatus })
  @ApiQuery({ name: 'type', required: false, enum: TransactionType })
  @ApiQuery({ name: 'userId', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: TransactionStatus,
    @Query('type') type?: TransactionType,
    @Query('userId') userId?: string,
  ) {
    return this.transactionsService.findAll(page, limit, status, type, userId);
  }

  @Get('my-transactions')
  @ApiOperation({ summary: 'Get current user transactions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getUserTransactions(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.transactionsService.getUserTransactions(user.sub, page, limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get transaction statistics' })
  getTransactionStats(@CurrentUser() user: any) {
    const userId = user.role === 'ADMIN' ? undefined : user.sub;
    return this.transactionsService.getTransactionStats(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    const userId = user.role === 'ADMIN' ? undefined : user.sub;
    return this.transactionsService.findOne(id, userId);
  }
}