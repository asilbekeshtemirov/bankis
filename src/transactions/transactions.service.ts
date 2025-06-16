import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateTransactionDto, VerifyTransactionDto } from './dto';
import { TransactionStatus, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private telegramService: TelegramService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { fromAccountNumber, toAccountNumber, amount, description } = createTransactionDto;

    // Validate accounts
    const [fromAccount, toAccount] = await Promise.all([
      this.prisma.account.findUnique({
        where: { accountNumber: fromAccountNumber },
        include: { user: true },
      }),
      this.prisma.account.findUnique({
        where: { accountNumber: toAccountNumber },
        include: { user: true },
      }),
    ]);

    if (!fromAccount) {
      throw new NotFoundException('Source account not found');
    }

    if (!toAccount) {
      throw new NotFoundException('Destination account not found');
    }

    // Check if user owns the source account
    if (fromAccount.userId !== userId) {
      throw new ForbiddenException('You can only transfer from your own accounts');
    }

    // Check sufficient balance
    if (Number(fromAccount.balance) < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Same account check
    if (fromAccountNumber === toAccountNumber) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    // Generate verification code
    const verificationCode = this.generateVerificationCode();

    // Create transaction with PENDING status
    const transaction = await this.prisma.transaction.create({
      data: {
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        fromUserId: fromAccount.userId,
        toUserId: toAccount.userId,
        amount,
        type: TransactionType.TRANSFER,
        status: TransactionStatus.PENDING,
        description,
        verificationCode,
      },
      include: {
        fromAccount: {
          include: { user: true },
        },
        toAccount: {
          include: { user: true },
        },
      },
    });

    // Send verification email
    await this.emailService.sendTransactionVerificationEmail(
      fromAccount.user.email,
      verificationCode,
      amount,
      toAccountNumber,
    );

    // Send Telegram notification
    await this.telegramService.sendTransactionNotification(
      fromAccount.user.telegramId,
      'PENDING',
      amount,
      toAccountNumber,
    );

    return {
      transactionId: transaction.id,
      message: 'Transaction created. Please verify with the code sent to your email.',
    };
  }

  async verifyTransaction(verifyTransactionDto: VerifyTransactionDto) {
    const { transactionId, verificationCode, email } = verifyTransactionDto;

    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        fromAccount: {
          include: { user: true },
        },
        toAccount: {
          include: { user: true },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.fromAccount.user.email !== email) {
      throw new ForbiddenException('Invalid email for this transaction');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Transaction is not pending');
    }

    if (transaction.verificationCode !== verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }

    // Check if verification code is still valid (10 minutes)
    const codeAge = Date.now() - transaction.createdAt.getTime();
    if (codeAge > 10 * 60 * 1000) {
      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: { status: TransactionStatus.FAILED },
      });
      throw new BadRequestException('Verification code expired');
    }

    // Recheck balance
    const currentFromAccount = await this.prisma.account.findUnique({
      where: { id: transaction.fromAccountId },
    });

    if (Number(currentFromAccount.balance) < Number(transaction.amount)) {
      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: { status: TransactionStatus.FAILED },
      });
      throw new BadRequestException('Insufficient balance');
    }

    // Execute transaction
    try {
      await this.prisma.$transaction(async (tx) => {
        // Deduct from source account
        await tx.account.update({
          where: { id: transaction.fromAccountId },
          data: {
            balance: {
              decrement: transaction.amount,
            },
          },
        });

        // Add to destination account
        await tx.account.update({
          where: { id: transaction.toAccountId },
          data: {
            balance: {
              increment: transaction.amount,
            },
          },
        });

        // Update transaction status
        await tx.transaction.update({
          where: { id: transactionId },
          data: {
            status: TransactionStatus.COMPLETED,
            isVerified: true,
            verifiedAt: new Date(),
          },
        });
      });

      // Send success notifications
      await Promise.all([
        this.telegramService.sendTransactionNotification(
          transaction.fromAccount.user.telegramId,
          'COMPLETED',
          Number(transaction.amount),
          transaction.toAccount.accountNumber,
        ),
        this.telegramService.sendTransactionNotification(
          transaction.toAccount.user.telegramId,
          'RECEIVED',
          Number(transaction.amount),
          transaction.fromAccount.accountNumber,
        ),
      ]);

      return {
        message: 'Transaction completed successfully',
        transactionId: transaction.id,
      };
    } catch (error) {
      // Mark transaction as failed
      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: { status: TransactionStatus.FAILED },
      });

      throw new BadRequestException('Transaction failed');
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: TransactionStatus,
    type?: TransactionType,
    userId?: string,
  ) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (userId) {
      where.OR = [
        { fromUserId: userId },
        { toUserId: userId },
      ];
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          fromAccount: {
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
          },
          toAccount: {
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
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
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
      where.OR = [
        { fromUserId: userId },
        { toUserId: userId },
      ];
    }

    const transaction = await this.prisma.transaction.findFirst({
      where,
      include: {
        fromAccount: {
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
        },
        toAccount: {
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
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async getUserTransactions(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: {
          OR: [
            { fromUserId: userId },
            { toUserId: userId },
          ],
        },
        include: {
          fromAccount: true,
          toAccount: true,
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
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({
        where: {
          OR: [
            { fromUserId: userId },
            { toUserId: userId },
          ],
        },
      }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionStats(userId?: string) {
    const where: any = {};
    
    if (userId) {
      where.OR = [
        { fromUserId: userId },
        { toUserId: userId },
      ];
    }

    const [total, completed, pending, failed] = await Promise.all([
      this.prisma.transaction.count({ where }),
      this.prisma.transaction.count({ 
        where: { ...where, status: TransactionStatus.COMPLETED } 
      }),
      this.prisma.transaction.count({ 
        where: { ...where, status: TransactionStatus.PENDING } 
      }),
      this.prisma.transaction.count({ 
        where: { ...where, status: TransactionStatus.FAILED } 
      }),
    ]);

    const totalAmount = await this.prisma.transaction.aggregate({
      where: { ...where, status: TransactionStatus.COMPLETED },
      _sum: { amount: true },
    });

    return {
      total,
      completed,
      pending,
      failed,
      totalAmount: totalAmount._sum.amount || 0,
    };
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}