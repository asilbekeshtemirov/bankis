"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const telegram_service_1 = require("../telegram/telegram.service");
const client_1 = require("@prisma/client");
let TransactionsService = class TransactionsService {
    constructor(prisma, telegramService) {
        this.prisma = prisma;
        this.telegramService = telegramService;
    }
    buildUserFilter(userId) {
        return {
            OR: [{ fromUserId: userId }, { toUserId: userId }],
        };
    }
    async create(userId, dto) {
        const { fromAccountNumber, toAccountNumber, amount, description } = dto;
        if (!amount || amount <= 0) {
            throw new common_1.BadRequestException('Amount must be a positive number');
        }
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
        if (!fromAccount)
            throw new common_1.NotFoundException('Sender account not found');
        if (!toAccount)
            throw new common_1.NotFoundException('Recipient account not found');
        if (fromAccountNumber === toAccountNumber)
            throw new common_1.BadRequestException('Transfers between the same account are not allowed');
        if (fromAccount.userId !== userId)
            throw new common_1.ForbiddenException('You can only transfer from your own accounts');
        if (Number(fromAccount.balance) < amount)
            throw new common_1.BadRequestException('Insufficient funds');
        let convertedAmount = amount;
        if (fromAccount.currency === 'USD' && toAccount.currency === 'UZS') {
            const usdToUzsRate = 12750;
            convertedAmount = amount * usdToUzsRate;
        }
        else if (fromAccount.currency !== toAccount.currency) {
            throw new common_1.BadRequestException('Only USD → UZS conversion is supported');
        }
        const transaction = await this.prisma.$transaction(async (tx) => {
            await tx.account.update({
                where: { id: fromAccount.id },
                data: { balance: { decrement: amount } },
            });
            await tx.account.update({
                where: { id: toAccount.id },
                data: { balance: { increment: convertedAmount } },
            });
            return tx.transaction.create({
                data: {
                    fromAccountId: fromAccount.id,
                    toAccountId: toAccount.id,
                    fromUserId: fromAccount.userId,
                    toUserId: toAccount.userId,
                    amount,
                    type: client_1.TransactionType.TRANSFER,
                    status: client_1.TransactionStatus.COMPLETED,
                    isVerified: true,
                    verifiedAt: new Date(),
                    description,
                },
                include: {
                    fromAccount: { include: { user: true } },
                    toAccount: { include: { user: true } },
                },
            });
        });
        await Promise.all([
            fromAccount.user.telegramId &&
                this.telegramService.sendTransactionNotification(fromAccount.user.telegramId, 'COMPLETED', amount, toAccountNumber),
            toAccount.user.telegramId &&
                this.telegramService.sendTransactionNotification(toAccount.user.telegramId, 'RECEIVED', convertedAmount, fromAccountNumber),
        ]);
        return {
            transactionId: transaction.id,
            message: 'Transaction completed successfully',
        };
    }
    async countUserTransactions(userId, where = {}) {
        return this.prisma.transaction.count({
            where: {
                ...where,
                ...this.buildUserFilter(userId),
            },
        });
    }
    async getExchangeRates() {
        return [
            { currency: 'USD', rate: 12750 },
            { currency: 'EUR', rate: 13800 },
            { currency: 'RUB', rate: 140 },
        ];
    }
    async findAll(page = 1, limit = 10, status, type, userId) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (type)
            where.type = type;
        if (userId)
            Object.assign(where, this.buildUserFilter(userId));
        const [transactions, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                include: {
                    fromAccount: { include: { user: true } },
                    toAccount: { include: { user: true } },
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
    async findOne(id, userId) {
        const where = userId
            ? {
                AND: [
                    { id },
                    this.buildUserFilter(userId),
                ],
            }
            : { id };
        const transaction = await this.prisma.transaction.findFirst({
            where,
            include: {
                fromAccount: { include: { user: true } },
                toAccount: { include: { user: true } },
            },
        });
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found');
        return transaction;
    }
    async getUserTransactions(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const userFilter = this.buildUserFilter(userId);
        const [transactions, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where: userFilter,
                include: {
                    fromAccount: { select: { accountNumber: true, currency: true } },
                    toAccount: { select: { accountNumber: true, currency: true } },
                    fromUser: { select: { id: true, firstName: true, lastName: true } },
                    toUser: { select: { id: true, firstName: true, lastName: true } },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.transaction.count({ where: userFilter }),
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
    async getTransactionStats(userId) {
        const where = userId ? this.buildUserFilter(userId) : {};
        const [total, completed, pending, failed] = await Promise.all([
            this.prisma.transaction.count({ where }),
            this.prisma.transaction.count({ where: { ...where, status: 'COMPLETED' } }),
            this.prisma.transaction.count({ where: { ...where, status: 'PENDING' } }),
            this.prisma.transaction.count({ where: { ...where, status: 'FAILED' } }),
        ]);
        const totalAmount = await this.prisma.transaction.aggregate({
            where: { ...where, status: 'COMPLETED' },
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
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        telegram_service_1.TelegramService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map