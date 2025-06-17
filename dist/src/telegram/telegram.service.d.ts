import { PrismaService } from '../prisma/prisma.service';
import { TransactionsService } from '../transactions/transactions.service';
import 'dayjs/locale/uz';
export declare class TelegramService {
    private readonly prisma;
    private readonly transactionsService;
    private readonly logger;
    private bot;
    private readonly PAGE_SIZE;
    private readonly sessionStore;
    constructor(prisma: PrismaService, transactionsService: TransactionsService);
    private setupBot;
    private showTransactions;
    sendTransactionNotification(telegramId: string, type: 'COMPLETED' | 'RECEIVED' | 'PENDING' | 'FAILED', amount: number, accountNumber: string): Promise<void>;
    sendDirectMessage(telegramId: string, message: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
    }>;
}
