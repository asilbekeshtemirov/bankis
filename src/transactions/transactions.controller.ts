import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a transaction (no email verification)' })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    schema: {
      example: {
        transactionId: 'uuid',
        message: 'Transaction completed successfully',
      },
    },
  })
  create(
    @Body() dto: CreateTransactionDto,
    @CurrentUser() user: any,
  ) {
    return this.transactionsService.create(user.id, dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all transactions (with filters)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'status', required: false, example: 'COMPLETED' })
  @ApiQuery({ name: 'type', required: false, example: 'TRANSFER' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of transactions',
    schema: {
      example: {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      },
    },
  })
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status: string,
    @Query('type') type: string,
    @CurrentUser() user: any,
  ) {
    return this.transactionsService.findAll(page, limit, status, type, user.id);
  }

  @Get('stats')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get transaction statistics (for authenticated user)' })
  @ApiResponse({
    status: 200,
    description: 'Transaction statistics',
    schema: {
      example: {
        total: 5,
        completed: 4,
        pending: 1,
        failed: 0,
        totalAmount: 123000,
      },
    },
  })
  getStats(@CurrentUser() user: any) {
    return this.transactionsService.getTransactionStats(user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get one transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction details',
    schema: {
      example: {
        id: 'uuid',
        amount: 50000,
        status: 'COMPLETED',
        type: 'TRANSFER',
        fromAccount: { accountNumber: '8600...' },
        toAccount: { accountNumber: '8600...' },
        createdAt: '2025-06-16T00:00:00Z',
      },
    },
  })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.transactionsService.findOne(id, user.id);
  }
}
