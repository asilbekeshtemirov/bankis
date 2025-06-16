import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto } from './dto';
export declare class AccountsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createAccountDto: CreateAccountDto): Promise<{
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
    }>;
    findAll(page?: number, limit?: number, search?: string, userId?: string): Promise<{
        data: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
                id: string;
            };
            _count: {
                transactionsFrom: number;
                transactionsTo: number;
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, userId?: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
        transactionsFrom: ({
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
        transactionsTo: ({
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
            fromUser: {
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
    } & {
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountNumber: string;
        balance: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        userId: string;
    }>;
    findByAccountNumber(accountNumber: string): Promise<{
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
    }>;
    update(id: string, userId: string, updateAccountDto: UpdateAccountDto, userRole: string): Promise<{
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
    }>;
    remove(id: string, userId: string, userRole: string): Promise<{
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountNumber: string;
        balance: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        userId: string;
    }>;
    getUserAccounts(userId: string): Promise<({
        _count: {
            transactionsFrom: number;
            transactionsTo: number;
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
    })[]>;
    getAccountBalance(accountNumber: string, userId: string, userRole: string): Promise<{
        accountNumber: string;
        balance: import("@prisma/client/runtime/library").Decimal;
        currency: string;
    }>;
    private generateAccountNumber;
}
