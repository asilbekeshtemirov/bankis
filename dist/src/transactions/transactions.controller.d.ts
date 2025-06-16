import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, VerifyTransactionDto } from './dto';
import { TransactionStatus, TransactionType } from '@prisma/client';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(user: any, createTransactionDto: CreateTransactionDto): Promise<{
        transactionId: string;
        message: string;
    }>;
    verifyTransaction(verifyTransactionDto: VerifyTransactionDto): Promise<{
        message: string;
        transactionId: string;
    }>;
    findAll(page?: number, limit?: number, status?: TransactionStatus, type?: TransactionType, userId?: string): Promise<{
        data: ({
            fromAccount: {
                user: {
                    email: string;
                    firstName: string;
                    lastName: string;
                    id: string;
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
                    firstName: string;
                    lastName: string;
                    id: string;
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
    getUserTransactions(user: any, page?: number, limit?: number): Promise<{
        data: ({
            fromAccount: {
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
                isActive: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                accountNumber: string;
                balance: import("@prisma/client/runtime/library").Decimal;
                currency: string;
                userId: string;
            };
            fromUser: {
                email: string;
                firstName: string;
                lastName: string;
                id: string;
            };
            toUser: {
                email: string;
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
    getTransactionStats(user: any): Promise<{
        total: number;
        completed: number;
        pending: number;
        failed: number;
        totalAmount: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    findOne(user: any, id: string): Promise<{
        fromAccount: {
            user: {
                email: string;
                firstName: string;
                lastName: string;
                id: string;
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
                firstName: string;
                lastName: string;
                id: string;
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
}
