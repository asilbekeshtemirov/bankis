import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, UpdateAccountDto } from './dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('accounts')
@Controller({ path: 'accounts', version: '1' })
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  create(@CurrentUser() user: any, @Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(user.sub, createAccountDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get all accounts (Admin/Manager only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'userId', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('userId') userId?: string,
  ) {
    return this.accountsService.findAll(page, limit, search, userId);
  }

  @Get('my-accounts')
  @ApiOperation({ summary: 'Get current user accounts' })
  getUserAccounts(@CurrentUser() user: any) {
    return this.accountsService.getUserAccounts(user.sub);
  }

  @Get('balance/:accountNumber')
  @ApiOperation({ summary: 'Get account balance' })
  getAccountBalance(
    @CurrentUser() user: any,
    @Param('accountNumber') accountNumber: string,
  ) {
    return this.accountsService.getAccountBalance(accountNumber, user.sub, user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    const userId = user.role === 'ADMIN' ? undefined : user.sub;
    return this.accountsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update account' })
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, user.sub, updateAccountDto, user.role);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.accountsService.remove(id, user.sub, user.role);
  }
}