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
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AccountsService = class AccountsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createAccountDto) {
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
    async findAll(page = 1, limit = 10, search, userId) {
        const skip = (page - 1) * limit;
        const where = {};
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
    async findOne(id, userId) {
        const where = { id };
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
            throw new common_1.NotFoundException('Account not found');
        }
        return account;
    }
    async findByAccountNumber(accountNumber) {
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
            throw new common_1.NotFoundException('Account not found');
        }
        return account;
    }
    async update(id, userId, updateAccountDto, userRole) {
        const account = await this.prisma.account.findUnique({
            where: { id },
        });
        if (!account) {
            throw new common_1.NotFoundException('Account not found');
        }
        if (account.userId !== userId && userRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
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
    async remove(id, userId, userRole) {
        const account = await this.prisma.account.findUnique({
            where: { id },
        });
        if (!account) {
            throw new common_1.NotFoundException('Account not found');
        }
        if (account.userId !== userId && userRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (Number(account.balance) > 0) {
            throw new common_1.BadRequestException('Cannot delete account with positive balance');
        }
        return this.prisma.account.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async getUserAccounts(userId) {
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
    async getAccountBalance(accountNumber, userId, userRole) {
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
            throw new common_1.NotFoundException('Account not found');
        }
        if (account.userId !== userId && userRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('Access denied');
        }
        return {
            accountNumber: account.accountNumber,
            balance: account.balance,
            currency: account.currency,
        };
    }
    generateAccountNumber() {
        const prefix = '8600';
        const suffix = Math.random().toString().slice(2, 14);
        return prefix + suffix;
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccountsService);
//# sourceMappingURL=accounts.service.js.map