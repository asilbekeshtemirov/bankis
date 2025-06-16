import { TelegramService } from './telegram.service';
export declare class TelegramController {
    private readonly telegramService;
    constructor(telegramService: TelegramService);
    sendMessage(body: {
        telegramId: string;
        message: string;
    }): Promise<{
        message: string;
    }>;
}
