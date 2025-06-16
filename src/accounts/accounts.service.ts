import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto } from './dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createAccountDto: CreateAccountDto) {
    const { currency } = createAccountDto;

    const accountNumber = this.generateAccountNumber();

    return this.prisma.account.create({
      data: {
        accountNumber,
        balance: 0,
        currency: currency || 'UZS',
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string, userId?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { accountNumber: { contains: search } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }
    
    if (userId) {
      where.userId = userId;
    }

    const [accounts, total] = await Promise.all([
      this.prisma.account.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              transactionsFrom: true,
              transactionsTo: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.account.count({ where }),
    ]);

    return {
      data: accounts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const where: any = { id };
    
    if (userId) {
      where.userId = userId;
    }

    const account = await this.prisma.account.findUnique({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        transactionsFrom: {
          include: {
            toAccount: true,
            toUser: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        transactionsTo: {
          include: {
            fromAccount: true,
            fromUser: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async findByAccountNumber(accountNumber: string) {
    const account = await this.prisma.account.findUnique({
      where: { accountNumber },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async update(id: string, userId: string, updateAccountDto: UpdateAccountDto, userRole: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Only account owner or admin can update
    if (account.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.account.update({
      where: { id },
      data: updateAccountDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Only account owner or admin can delete
    if (account.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    // Check if account has balance
    if (Number(account.balance) > 0) {
      throw new BadRequestException('Cannot delete account with positive balance');
    }

    // Soft delete by deactivating
    return this.prisma.account.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getUserAccounts(userId: string) {
    return this.prisma.account.findMany({
      where: { userId, isActive: true },
      include: {
        _count: {
          select: {
            transactionsFrom: true,
            transactionsTo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAccountBalance(accountNumber: string, userId: string, userRole: string) {
    const account = await this.prisma.account.findUnique({
      where: { accountNumber },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Only account owner or admin can view balance
    if (account.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    return {
      accountNumber: account.accountNumber,
      balance: account.balance,
      currency: account.currency,
    };
  }

  private generateAccountNumber(): string {
    const prefix = '8600';
    const suffix = Math.random().toString().slice(2, 14);
    return prefix + suffix;
  }
}