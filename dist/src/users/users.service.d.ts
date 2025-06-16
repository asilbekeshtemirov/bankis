import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UpdateProfileDto } from './dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        role: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            displayName: string;
            description: string | null;
        };
        language: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
        };
        accounts: {
            id: string;
            isActive: boolean;
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
        roleId: string;
        languageId: string;
        id: string;
        googleId: string | null;
        phone: string | null;
        isActive: boolean;
        telegramId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(page?: number, limit?: number, search?: string, role?: string): Promise<{
        data: ({
            role: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                displayName: string;
                description: string | null;
            };
            language: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string;
            };
            accounts: {
                id: string;
                isActive: boolean;
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
            roleId: string;
            languageId: string;
            id: string;
            googleId: string | null;
            phone: string | null;
            isActive: boolean;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            displayName: string;
            description: string | null;
        };
        language: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
        };
        accounts: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            accountNumber: string;
            balance: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            userId: string;
        }[];
        transfersFrom: ({
            toAccount: {
                id: string;
                isActive: boolean;
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
                roleId: string;
                languageId: string;
                id: string;
                googleId: string | null;
                phone: string | null;
                isActive: boolean;
                telegramId: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            currency: string;
            fromAccountId: string | null;
            toAccountId: string | null;
            fromUserId: string;
            toUserId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            fee: import("@prisma/client/runtime/library").Decimal;
            status: import("@prisma/client").$Enums.TransactionStatus;
            type: import("@prisma/client").$Enums.TransactionType;
            verificationCode: string | null;
            isVerified: boolean;
            verifiedAt: Date | null;
        })[];
        transfersTo: ({
            fromAccount: {
                id: string;
                isActive: boolean;
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
                roleId: string;
                languageId: string;
                id: string;
                googleId: string | null;
                phone: string | null;
                isActive: boolean;
                telegramId: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            currency: string;
            fromAccountId: string | null;
            toAccountId: string | null;
            fromUserId: string;
            toUserId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            fee: import("@prisma/client/runtime/library").Decimal;
            status: import("@prisma/client").$Enums.TransactionStatus;
            type: import("@prisma/client").$Enums.TransactionType;
            verificationCode: string | null;
            isVerified: boolean;
            verifiedAt: Date | null;
        })[];
    } & {
        email: string;
        password: string | null;
        firstName: string | null;
        lastName: string | null;
        roleId: string;
        languageId: string;
        id: string;
        googleId: string | null;
        phone: string | null;
        isActive: boolean;
        telegramId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        role: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            displayName: string;
            description: string | null;
        };
        language: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
        };
        accounts: {
            id: string;
            isActive: boolean;
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
        roleId: string;
        languageId: string;
        id: string;
        googleId: string | null;
        phone: string | null;
        isActive: boolean;
        telegramId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        role: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            displayName: string;
            description: string | null;
        };
        language: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
        };
        accounts: {
            id: string;
            isActive: boolean;
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
        roleId: string;
        languageId: string;
        id: string;
        googleId: string | null;
        phone: string | null;
        isActive: boolean;
        telegramId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        email: string;
        password: string | null;
        firstName: string | null;
        lastName: string | null;
        roleId: string;
        languageId: string;
        id: string;
        googleId: string | null;
        phone: string | null;
        isActive: boolean;
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
        roleId: string;
        languageId: string;
        id: string;
        googleId: string | null;
        phone: string | null;
        isActive: boolean;
        telegramId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private generateAccountNumber;
}
