import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/transaction.dto';
import { FindTransactionsDto } from './dto/find-transactions.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(dto: CreateTransactionDto, req: any): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            description: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            status: import("@prisma/client").$Enums.TransactionStatus;
            type: import("@prisma/client").$Enums.TransactionType;
        };
    }>;
    findAll(req: any, query: FindTransactionsDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
    findOne(id: string, req: any): Promise<{
        message: string;
        data: {
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
        };
    }>;
}
