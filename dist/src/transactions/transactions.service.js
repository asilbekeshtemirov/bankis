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
const email_service_1 = require("../email/email.service");
const telegram_service_1 = require("../telegram/telegram.service");
const client_1 = require("@prisma/client");
let TransactionsService = class TransactionsService {
    constructor(prisma, emailService, telegramService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.telegramService = telegramService;
    }
    async create(userId, createTransactionDto) {
        const { fromAccountNumber, toAccountNumber, amount, description } = createTransactionDto;
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
            throw new common_1.NotFoundException('Source account not found');
        }
        if (!toAccount) {
            throw new common_1.NotFoundException('Destination account not found');
        }
        if (fromAccount.userId !== userId) {
            throw new common_1.ForbiddenException('You can only transfer from your own accounts');
        }
        if (Number(fromAccount.balance) < amount) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        if (fromAccountNumber === toAccountNumber) {
            throw new common_1.BadRequestException('Cannot transfer to the same account');
        }
        const verificationCode = this.generateVerificationCode();
        const transaction = await this.prisma.transaction.create({
            data: {
                fromAccountId: fromAccount.id,
                toAccountId: toAccount.id,
                fromUserId: fromAccount.userId,
                toUserId: toAccount.userId,
                amount,
                type: client_1.TransactionType.TRANSFER,
                status: client_1.TransactionStatus.PENDING,
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
        await this.emailService.sendTransactionVerificationEmail(fromAccount.user.email, verificationCode, amount, toAccountNumber);
        await this.telegramService.sendTransactionNotification(fromAccount.user.telegramId, 'PENDING', amount, toAccountNumber);
        return {
            transactionId: transaction.id,
            message: 'Transaction created. Please verify with the code sent to your email.',
        };
    }
    async verifyTransaction(verifyTransactionDto) {
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
            throw new common_1.NotFoundException('Transaction not found');
        }
        if (transaction.fromAccount.user.email !== email) {
            throw new common_1.ForbiddenException('Invalid email for this transaction');
        }
        if (transaction.status !== client_1.TransactionStatus.PENDING) {
            throw new common_1.BadRequestException('Transaction is not pending');
        }
        if (transaction.verificationCode !== verificationCode) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        const codeAge = Date.now() - transaction.createdAt.getTime();
        if (codeAge > 10 * 60 * 1000) {
            await this.prisma.transaction.update({
                where: { id: transactionId },
                data: { status: client_1.TransactionStatus.FAILED },
            });
            throw new common_1.BadRequestException('Verification code expired');
        }
        const currentFromAccount = await this.prisma.account.findUnique({
            where: { id: transaction.fromAccountId },
        });
        if (Number(currentFromAccount.balance) < Number(transaction.amount)) {
            await this.prisma.transaction.update({
                where: { id: transactionId },
                data: { status: client_1.TransactionStatus.FAILED },
            });
            throw new common_1.BadRequestException('Insufficient balance');
        }
        try {
            await this.prisma.$transaction(async (tx) => {
                await tx.account.update({
                    where: { id: transaction.fromAccountId },
                    data: {
                        balance: {
                            decrement: transaction.amount,
                        },
                    },
                });
                await tx.account.update({
                    where: { id: transaction.toAccountId },
                    data: {
                        balance: {
                            increment: transaction.amount,
                        },
                    },
                });
                await tx.transaction.update({
                    where: { id: transactionId },
                    data: {
                        status: client_1.TransactionStatus.COMPLETED,
                        isVerified: true,
                        verifiedAt: new Date(),
                    },
                });
            });
            await Promise.all([
                this.telegramService.sendTransactionNotification(transaction.fromAccount.user.telegramId, 'COMPLETED', Number(transaction.amount), transaction.toAccount.accountNumber),
                this.telegramService.sendTransactionNotification(transaction.toAccount.user.telegramId, 'RECEIVED', Number(transaction.amount), transaction.fromAccount.accountNumber),
            ]);
            return {
                message: 'Transaction completed successfully',
                transactionId: transaction.id,
            };
        }
        catch (error) {
            await this.prisma.transaction.update({
                where: { id: transactionId },
                data: { status: client_1.TransactionStatus.FAILED },
            });
            throw new common_1.BadRequestException('Transaction failed');
        }
    }
    async findAll(page = 1, limit = 10, status, type, userId) {
        const skip = (page - 1) * limit;
        const where = {};
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
    async findOne(id, userId) {
        const where = { id };
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
            throw new common_1.NotFoundException('Transaction not found');
        }
        return transaction;
    }
    async getUserTransactions(userId, page = 1, limit = 10) {
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
    async getTransactionStats(userId) {
        const where = {};
        if (userId) {
            where.OR = [
                { fromUserId: userId },
                { toUserId: userId },
            ];
        }
        const [total, completed, pending, failed] = await Promise.all([
            this.prisma.transaction.count({ where }),
            this.prisma.transaction.count({
                where: { ...where, status: client_1.TransactionStatus.COMPLETED }
            }),
            this.prisma.transaction.count({
                where: { ...where, status: client_1.TransactionStatus.PENDING }
            }),
            this.prisma.transaction.count({
                where: { ...where, status: client_1.TransactionStatus.FAILED }
            }),
        ]);
        const totalAmount = await this.prisma.transaction.aggregate({
            where: { ...where, status: client_1.TransactionStatus.COMPLETED },
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
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        telegram_service_1.TelegramService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map