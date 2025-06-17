import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UpdateProfileDto } from './dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        role: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            displayName: string;
        };
        language: {
            name: string;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
        accounts: {
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            accountNumber: string;
            balance: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            userId: string;
        }[];
    } & {
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
    }>;
    findAll(page?: number, limit?: number, search?: string, role?: string): Promise<{
        data: ({
            role: {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                displayName: string;
            };
            language: {
                name: string;
                isActive: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
            };
            accounts: {
                isActive: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                accountNumber: string;
                balance: import("@prisma/client/runtime/library").Decimal;
                currency: string;
                userId: string;
            }[];
            _count: {
                transfersFrom: number;
                transfersTo: number;
            };
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        role: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            displayName: string;
        };
        language: {
            name: string;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
        accounts: {
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            accountNumber: string;
            balance: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            userId: string;
        }[];
        transfersFrom: ({
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
        transfersTo: ({
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
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        role: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            displayName: string;
        };
        language: {
            name: string;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
        accounts: {
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            accountNumber: string;
            balance: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            userId: string;
        }[];
    } & {
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
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        role: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            displayName: string;
        };
        language: {
            name: string;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
        accounts: {
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            accountNumber: string;
            balance: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            userId: string;
        }[];
    } & {
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
    }>;
    remove(id: string): Promise<{
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
    }>;
    getUserStats(userId: string): Promise<{
        totalAccounts: number;
        totalBalance: number;
        totalTransfersSent: number;
        totalTransfersReceived: number;
        totalTransfers: number;
    }>;
    findById(id: string): Promise<{
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
    }>;
    private generateAccountNumber;
}
