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
let TransactionsService = class TransactionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTransactionDto) {
        const { userId, accountId, amount, type, description, currency } = createTransactionDto;
        const account = await this.prisma.account.findFirst({
            where: { id: accountId, userId, isActive: true },
        });
        if (!account)
            throw new common_1.NotFoundException('Account not found');
        if (type === 'WITHDRAWAL' && account.balance.toNumber() < amount) {
            throw new common_1.BadRequestException('Insufficient balance');
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
    async findAllByUserId(userId, params) {
        const { page, limit, accountId, type } = params;
        const skip = (page - 1) * limit;
        const where = {
            OR: [{ fromUserId: userId }, { toUserId: userId }],
        };
        if (accountId) {
            where.OR = [
                { fromAccountId: accountId },
                { toAccountId: accountId },
            ];
        }
        if (type)
            where.type = type;
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
    async findOneByUserAndId(userId, transactionId) {
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
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found');
        return transaction;
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map