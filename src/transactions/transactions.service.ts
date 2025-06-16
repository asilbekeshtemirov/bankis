import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/transaction.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto & { userId: string }) {
    const { userId, accountId, amount, type, description, currency } = createTransactionDto;

    const account = await this.prisma.account.findFirst({
      where: { id: accountId, userId, isActive: true },
    });

    if (!account) throw new NotFoundException('Account not found');

    if (type === 'WITHDRAWAL' && account.balance.toNumber() < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          amount,
          type,
          description,
          currency: currency || account.currency,
          status: 'COMPLETED',
          fromUserId: userId,
          toUserId: userId,
          fromAccountId: type === 'WITHDRAWAL' ? accountId : null,
          toAccountId: type === 'DEPOSIT' ? accountId : null,
        },
        select: {
          id: true,
          amount: true,
          type: true,
          description: true,
          status: true,
          createdAt: true,
        },
      });

      const newBalance = type === 'DEPOSIT'
        ? account.balance.toNumber() + amount
        : account.balance.toNumber() - amount;

      await tx.account.update({
        where: { id: accountId },
        data: { balance: newBalance },
      });

      return transaction;
    });

    return result;
  }

  async findAllByUserId(userId: string, params: { page: number; limit: number; accountId?: string; type?: string }) {
    const { page, limit, accountId, type } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    };

    if (accountId) {
      where.OR = [
        { fromAccountId: accountId },
        { toAccountId: accountId },
      ];
    }

    if (type) where.type = type;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          amount: true,
          type: true,
          description: true,
          status: true,
          createdAt: true,
          fromAccount: {
            select: {
              id: true,
              accountNumber: true,
            },
          },
          toAccount: {
            select: {
              id: true,
              accountNumber: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOneByUserAndId(userId: string, transactionId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        fromAccount: {
          select: {
            id: true,
            accountNumber: true,
            balance: true,
          },
        },
        toAccount: {
          select: {
            id: true,
            accountNumber: true,
            balance: true,
          },
        },
        fromUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        toUser: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    return transaction;
  }
}
