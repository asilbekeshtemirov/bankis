import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(dto: CreateTransactionDto, user: any): Promise<{
        transactionId: string;
        message: string;
    }>;
    findAll(page: number, limit: number, status: string, type: string, user: any): Promise<{
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
    getStats(user: any): Promise<{
        total: number;
        completed: number;
        pending: number;
        failed: number;
        totalAmount: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    findOne(id: string, user: any): Promise<{
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
}
