import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateTransactionDto } from './dto';
export declare class TransactionsService {
    private prisma;
    private telegramService;
    constructor(prisma: PrismaService, telegramService: TelegramService);
    private buildUserFilter;
    create(userId: string, dto: CreateTransactionDto): Promise<{
        transactionId: string;
        message: string;
    }>;
    countUserTransactions(userId: string, where?: any): Promise<number>;
    getExchangeRates(): Promise<{
        currency: string;
        rate: number;
    }[]>;
    findAll(page?: number, limit?: number, status?: any, type?: any, userId?: any): Promise<{
        data: ({
            fromAccount: {
                user: {
                    email: string;
                    password: string | null;
                    firstName: string | null;
                    lastName: string | null;
                    phone: string | null;
                    roleId: string;
                    languageId: string;
                    isActive: boolean;
                    id: string;
                    googleId: string | null;
                    telegramId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                isActive: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                accountNumber: string;
                balance: import("@prisma/client/runtime/library").Decimal;
                currency: string;
                userId: string;
            };
            toAccount: {
                user: {
                    email: string;
                    password: string | null;
                    firstName: string | null;
                    lastName: string | null;
                    phone: string | null;
                    roleId: string;
                    languageId: string;
                    isActive: boolean;
                    id: string;
                    googleId: string | null;
                    telegramId: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                isActive: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                accountNumber: string;
                balance: import("@prisma/client/runtime/library").Decimal;
                currency: string;
                userId: string;
            };
        } & {
            type: import("@prisma/client").$Enums.TransactionType;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            fromAccountId: string | null;
            toAccountId: string | null;
            fromUserId: string;
            toUserId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            fee: import("@prisma/client/runtime/library").Decimal;
            status: import("@prisma/client").$Enums.TransactionStatus;
            verificationCode: string | null;
            isVerified: boolean;
            verifiedAt: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, userId?: string): Promise<{
        fromAccount: {
            user: {
                email: string;
                password: string | null;
                firstName: string | null;
                lastName: string | null;
                phone: string | null;
                roleId: string;
                languageId: string;
                isActive: boolean;
                id: string;
                googleId: string | null;
                telegramId: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            accountNumber: string;
            balance: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            userId: string;
        };
        toAccount: {
            user: {
                email: string;
                password: string | null;
                firstName: string | null;
                lastName: string | null;
                phone: string | null;
                roleId: string;
                languageId: string;
                isActive: boolean;
                id: string;
                googleId: string | null;
                telegramId: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            accountNumber: string;
            balance: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            userId: string;
        };
    } & {
        type: import("@prisma/client").$Enums.TransactionType;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        fromAccountId: string | null;
        toAccountId: string | null;
        fromUserId: string;
        toUserId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        fee: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.TransactionStatus;
        verificationCode: string | null;
        isVerified: boolean;
        verifiedAt: Date | null;
    }>;
    getUserTransactions(userId: string, page?: number, limit?: number): Promise<{
        data: ({
            fromAccount: {
                accountNumber: string;
                currency: string;
            };
            toAccount: {
                accountNumber: string;
                currency: string;
            };
            fromUser: {
                firstName: string;
                lastName: string;
                id: string;
            };
            toUser: {
                firstName: string;
                lastName: string;
                id: string;
            };
        } & {
            type: import("@prisma/client").$Enums.TransactionType;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            fromAccountId: string | null;
            toAccountId: string | null;
            fromUserId: string;
            toUserId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            fee: import("@prisma/client/runtime/library").Decimal;
            status: import("@prisma/client").$Enums.TransactionStatus;
            verificationCode: string | null;
            isVerified: boolean;
            verifiedAt: Date | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getTransactionStats(userId?: string): Promise<{
        total: number;
        completed: number;
        pending: number;
        failed: number;
        totalAmount: number | import("@prisma/client/runtime/library").Decimal;
    }>;
}
