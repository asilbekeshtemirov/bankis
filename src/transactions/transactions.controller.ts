import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/transaction.dto';
import { FindTransactionsDto } from './dto/find-transactions.dto';

@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction successfully created.' })
  async create(@Body() dto: CreateTransactionDto, @Req() req: any) {
    const transaction = await this.transactionsService.create({
      ...dto,
      userId: req.user.id,
    });

    return {
      message: 'Transaction created successfully',
      data: transaction,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get user transactions' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully.' })
  async findAll(@Req() req: any, @Query() query: FindTransactionsDto) {
    const transactions = await this.transactionsService.findAllByUserId(req.user.id, {
      page: parseInt(query.page || '1'),
      limit: parseInt(query.limit || '10'),
      accountId: query.accountId,
      type: query.type,
    });

    return {
      message: 'Transactions retrieved successfully',
      data: transactions,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const transaction = await this.transactionsService.findOneByUserAndId(req.user.id, id);
    return {
      message: 'Transaction retrieved successfully',
      data: transaction,
    };
  }
}
