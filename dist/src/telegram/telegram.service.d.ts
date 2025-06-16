import { PrismaService } from '../prisma/prisma.service';
export declare class TelegramService {
    private prisma;
    private readonly logger;
    private bot;
    constructor(prisma: PrismaService);
    private setupBot;
    sendTransactionNotification(telegramId: string, type: 'PENDING' | 'COMPLETED' | 'FAILED' | 'RECEIVED', amount: number, accountNumber: string): Promise<void>;
    sendMessage(telegramId: string, message: string): Promise<void>;
    onModuleDestroy(): void;
}
