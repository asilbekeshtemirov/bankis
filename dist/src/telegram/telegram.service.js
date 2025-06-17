"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const transactions_service_1 = require("../transactions/transactions.service");
const telegraf_1 = require("telegraf");
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/uz");
dayjs_1.default.locale('uz');
let TelegramService = TelegramService_1 = class TelegramService {
    constructor(prisma, transactionsService) {
        this.prisma = prisma;
        this.transactionsService = transactionsService;
        this.logger = new common_1.Logger(TelegramService_1.name);
        this.PAGE_SIZE = 5;
        this.sessionStore = new Map();
        this.bot = new telegraf_1.Telegraf(process.env.TELEGRAM_BOT_TOKEN);
        this.setupBot();
        this.bot.launch();
        this.logger.log('✅ Telegram bot ishga tushdi');
    }
    setupBot() {
        this.bot.start(async (ctx) => {
            const tgId = ctx.from.id.toString();
            const user = await this.prisma.user.findUnique({ where: { telegramId: tgId } });
            if (user) {
                const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
                await ctx.replyWithHTML(`
🏦 <b>BankIS Bot – Xush kelibsiz, ${name || 'Foydalanuvchi'}!</b>

🔹 Hisoblarni boshqarish  
🔹 Balansni tekshirish  
🔹 Tranzaksiyalar tarixini ko‘rish  


<i>Telegram ichida tez, xavfsiz va qulay xizmat!</i>

⬇ <b>Boshlash uchun buyruqlardan birini tanlang:</b>
💼 /balance – Balansni ko‘rish  
📜 /mytransactions – Tranzaksiyalar  
💱 /currency – Valyuta kurslari  
❓ /help – Qo‘llanma`);
            }
            else {
                await ctx.reply('🛡 Ro‘yxatdan o‘tish uchun telefon raqamingizni yuboring.', {
                    reply_markup: {
                        keyboard: [[{ text: '📞 Telefon raqam', request_contact: true }]],
                        one_time_keyboard: true,
                        resize_keyboard: true,
                    },
                });
            }
        });
        this.bot.on('contact', async (ctx) => {
            const tgId = ctx.from.id.toString();
            let phone = ctx.message.contact?.phone_number;
            if (!phone)
                return ctx.reply('❗ Telefon raqam topilmadi.');
            phone = phone.replace(/^\+?998/, '');
            const user = await this.prisma.user.findFirst({
                where: { phone: { endsWith: phone } },
            });
            if (!user)
                return ctx.reply('❌ Ushbu raqamga mos foydalanuvchi topilmadi.');
            await this.prisma.user.update({ where: { id: user.id }, data: { telegramId: tgId } });
            const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            await ctx.reply(`✅ Salom, ${name}! Telegram hisobingiz bog‘landi.`);
            await ctx.reply(`💰 /mytransactions — Tranzaksiyalar\n💼 /balance — Hisob balansingizni ko‘rish`);
        });
        this.bot.command('balance', async (ctx) => {
            const tgId = ctx.from.id.toString();
            const user = await this.prisma.user.findUnique({
                where: { telegramId: tgId },
                include: { accounts: true },
            });
            if (!user)
                return ctx.reply('❗ Avval /start orqali ro‘yxatdan o‘ting.');
            if (!user.accounts.length)
                return ctx.reply('💼 Hisob mavjud emas.');
            let msg = `🏦 Hisoblaringizdagi balans:\n`;
            for (const acc of user.accounts) {
                msg += `🔹 ${acc.accountNumber}\n💵 ${acc.balance} ${acc.currency}\n\n`;
            }
            await ctx.reply(msg.trim());
        });
        this.bot.command('currency', async (ctx) => {
            const tgId = ctx.from.id.toString();
            const user = await this.prisma.user.findUnique({ where: { telegramId: tgId } });
            if (!user)
                return ctx.reply('❗ Avval /start orqali ro‘yxatdan o‘ting.');
            const rates = await this.transactionsService.getExchangeRates();
            if (!rates || rates.length === 0) {
                return ctx.reply('❗ Valyuta kurslari mavjud emas.');
            }
            let msg = '<b>💱 Bugungi valyuta kurslari (UZS):</b>\n\n';
            for (const rate of rates) {
                msg += `🔹 1 ${rate.currency} = ${rate.rate} UZS\n`;
            }
            await ctx.replyWithHTML(msg.trim());
        });
        this.bot.command('help', async (ctx) => {
            await ctx.replyWithHTML(`
❓ <b>Yordam</b>

Quyidagi komandalar orqali botdan foydalanishingiz mumkin:
/start - Botni ishga tushurish yoki autentifikatsiya  
/balance - Hisobingizdagi mablag‘ni ko‘rish  
/mytransactions - Oxirgi tranzaksiyalar  
/currency - Valyuta kurslari  
/help - Qo‘llanma`);
        });
        this.bot.command('mytransactions', async (ctx) => {
            const tgId = ctx.from.id.toString();
            const user = await this.prisma.user.findUnique({ where: { telegramId: tgId } });
            if (!user)
                return ctx.reply('❗ Avval /start orqali ro‘yxatdan o‘ting.');
            this.sessionStore.set(tgId, { filter: null, page: 1, userId: user.id });
            return ctx.reply('🗓 Qaysi davr uchun tranzaksiyalarni ko‘rmoqchisiz?', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🕖 So‘nggi 7 kun', callback_data: 'filter_7' }],
                        [{ text: '📆 So‘nggi 30 kun', callback_data: 'filter_30' }],
                        [{ text: '🗓 So‘nggi 90 kun', callback_data: 'filter_90' }],
                        [{ text: '📜 Barchasi', callback_data: 'filter_all' }],
                    ],
                },
            });
        });
        this.bot.on('callback_query', async (ctx) => {
            const tgId = ctx.from.id.toString();
            const session = this.sessionStore.get(tgId);
            if (!session)
                return ctx.answerCbQuery('⛔ Oldin /mytransactions buyrug‘ini bering');
            if ('data' in ctx.callbackQuery) {
                const callback = ctx.callbackQuery.data;
                if (callback.startsWith('filter_')) {
                    const days = callback === 'filter_all' ? null : parseInt(callback.split('_')[1], 10);
                    this.sessionStore.set(tgId, { ...session, filter: days, page: 1 });
                    return this.showTransactions(ctx, tgId);
                }
                if (callback === 'next_page' || callback === 'prev_page') {
                    const pageChange = callback === 'next_page' ? 1 : -1;
                    session.page = Math.max(1, session.page + pageChange);
                    this.sessionStore.set(tgId, session);
                    return this.showTransactions(ctx, tgId);
                }
            }
        });
        this.bot.catch((err, ctx) => {
            this.logger.error('⚠️ Botda xatolik:', err);
            ctx.reply('❌ Botda xatolik yuz berdi.');
        });
    }
    async showTransactions(ctx, tgId) {
        const session = this.sessionStore.get(tgId);
        const { userId, filter, page, lastMessageIds = [] } = session;
        for (const msgId of lastMessageIds) {
            try {
                await ctx.deleteMessage(msgId);
            }
            catch (err) {
            }
        }
        const filterWhere = {};
        if (filter) {
            const fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - filter);
            filterWhere.createdAt = { gte: fromDate };
        }
        const [result, total] = await Promise.all([
            this.transactionsService.getUserTransactions(userId, page, this.PAGE_SIZE),
            this.transactionsService.countUserTransactions(userId, filterWhere),
        ]);
        const transactions = result.data;
        const totalPages = result.meta.totalPages;
        if (!transactions || transactions.length === 0) {
            const message = await ctx.reply('💬 Tranzaksiya topilmadi.');
            session.lastMessageIds = [message.message_id];
            return;
        }
        const emojiMap = {
            COMPLETED: '✅',
            PENDING: '⏳',
            FAILED: '❌',
            RECEIVED: '💰',
        };
        const messageIds = [];
        for (const tx of transactions) {
            const emoji = emojiMap[tx.status] || '🔁';
            const formattedAmount = new Intl.NumberFormat('uz-UZ', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(Number(tx.amount));
            const createdAt = new Date(tx.createdAt).toLocaleString('uz-UZ');
            const msg = `
  ${emoji} <b>${formattedAmount} ${tx.fromAccount.currency}</b>
  📌 <b>Status:</b> ${tx.status}
  🟢 <b>From:</b> ${tx.fromAccount.accountNumber}
  🔵 <b>To:</b> ${tx.toAccount.accountNumber}
  📅 <b>Sana:</b> ${createdAt}
  ━━━━━━━━━━━━━━━━━━━`.trim();
            const m = await ctx.replyWithHTML(msg);
            messageIds.push(m.message_id);
        }
        const buttons = [];
        if (page > 1)
            buttons.push({ text: '⬅️ Oldingi', callback_data: 'prev_page' });
        if (page < totalPages)
            buttons.push({ text: '➡️ Keyingi', callback_data: 'next_page' });
        const metaMsg = await ctx.reply(`📄 Sahifa ${page}/${totalPages}`, {
            reply_markup: { inline_keyboard: [buttons] },
        });
        messageIds.push(metaMsg.message_id);
        session.lastMessageIds = messageIds;
    }
    async sendTransactionNotification(telegramId, type, amount, accountNumber) {
        if (!telegramId)
            return;
        const emojiMap = {
            COMPLETED: '✅',
            RECEIVED: '💰',
            PENDING: '⏳',
            FAILED: '❌',
        };
        const emoji = emojiMap[type] || '';
        const text = type === 'COMPLETED'
            ? `${emoji} Siz ${amount} UZS yubordingiz → ${accountNumber}`
            : type === 'RECEIVED'
                ? `${emoji} Sizga ${amount} UZS keldi 💵 from ${accountNumber}`
                : `${emoji} Tranzaksiya: ${amount} UZS → ${accountNumber}`;
        try {
            await this.bot.telegram.sendMessage(telegramId, text);
        }
        catch (err) {
            this.logger.error('Xabar yuborilmadi:', err);
        }
    }
    async sendDirectMessage(telegramId, message) {
        if (!telegramId || !message) {
            this.logger.warn('Xabar uchun telegramId yoki message yo‘q');
            return { success: false, message: 'telegramId va message talab qilinadi' };
        }
        try {
            await this.bot.telegram.sendMessage(telegramId, message);
            this.logger.log(`Xabar yuborildi: ${telegramId} => ${message}`);
            return { success: true, message: 'Xabar yuborildi' };
        }
        catch (err) {
            this.logger.error('Xabar yuborishda xatolik:', err);
            return { success: false, message: 'Xabar yuborilmadi', error: err.message };
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => transactions_service_1.TransactionsService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        transactions_service_1.TransactionsService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map