import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/transaction.dto';
export declare class TransactionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createTransactionDto: CreateTransactionDto & {
        userId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.TransactionStatus;
        type: import("@prisma/client").$Enums.TransactionType;
    }>;
    findAllByUserId(userId: string, params: {
        page: number;
        limit: number;
        accountId?: string;
        type?: string;
    }): Promise<{
        transactions: {
            id: string;
            createdAt: Date;
            description: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            status: import("@prisma/client").$Enums.TransactionStatus;
            type: import("@prisma/client").$Enums.TransactionType;
            fromAccount: {
                id: string;
                accountNumber: string;
            };
            toAccount: {
                id: string;
                accountNumber: string;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOneByUserAndId(userId: string, transactionId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.TransactionStatus;
        type: import("@prisma/client").$Enums.TransactionType;
        fromAccount: {
            id: string;
            accountNumber: string;
            balance: import("@prisma/client/runtime/library").Decimal;
        };
        toAccount: {
            id: string;
            accountNumber: string;
            balance: import("@prisma/client/runtime/library").Decimal;
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
    }>;
}
