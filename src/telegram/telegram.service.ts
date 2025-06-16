import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Telegraf, Context } from 'telegraf';

interface BotContext extends Context {
  session?: any;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private bot: Telegraf<BotContext>;

  constructor(private prisma: PrismaService) {
    if (process.env.TELEGRAM_BOT_TOKEN) {
      this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
      this.setupBot();
      this.bot.launch();
      this.logger.log('Telegram bot started');
    } else {
      this.logger.warn('Telegram bot token not provided');
    }
  }

  private setupBot() {
    // Start command
    this.bot.start((ctx) => {
      ctx.reply(
        'Welcome to BankIS Bot! 🏦\n\n' +
        'Available commands:\n' +
        '/link - Link your account\n' +
        '/balance - Check account balance\n' +
        '/history - View transaction history\n' +
        '/help - Show help'
      );
    });

    // Help command
    this.bot.help((ctx) => {
      ctx.reply(
        'BankIS Bot Commands:\n\n' +
        '/start - Start the bot\n' +
        '/link <email> - Link your account with email\n' +
        '/balance - Check your account balances\n' +
        '/history - View recent transactions\n' +
        '/unlink - Unlink your account\n' +
        '/help - Show this help message'
      );
    });

    // Link account command
    this.bot.command('link', async (ctx) => {
      const args = ctx.message.text.split(' ');
      if (args.length < 2) {
        ctx.reply('Please provide your email: /link your-email@example.com');
        return;
      }

      const email = args[1];
      const telegramId = ctx.from.id.toString();

      try {
        const user = await this.prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          ctx.reply('❌ User not found with this email address.');
          return;
        }

        if (user.telegramId && user.telegramId !== telegramId) {
          ctx.reply('❌ This email is already linked to another Telegram account.');
          return;
        }

        await this.prisma.user.update({
          where: { email },
          data: { telegramId },
        });

        ctx.reply('✅ Account linked successfully! You will now receive notifications.');
      } catch (error) {
        this.logger.error('Error linking account:', error);
        ctx.reply('❌ Failed to link account. Please try again.');
      }
    });

    // Check balance command
    this.bot.command('balance', async (ctx) => {
      const telegramId = ctx.from.id.toString();

      try {
        const user = await this.prisma.user.findUnique({
          where: { telegramId },
          include: {
            accounts: {
              where: { isActive: true },
            },
          },
        });

        if (!user) {
          ctx.reply('❌ Account not linked. Use /link <email> to link your account.');
          return;
        }

        if (user.accounts.length === 0) {
          ctx.reply('❌ No accounts found.');
          return;
        }

        let message = '💰 Your Account Balances:\n\n';
        user.accounts.forEach((account, index) => {
          message += `${index + 1}. Account: ${account.accountNumber}\n`;
          message += `   Balance: ${Number(account.balance).toLocaleString()} ${account.currency}\n\n`;
        });

        ctx.reply(message);
      } catch (error) {
        this.logger.error('Error getting balance:', error);
        ctx.reply('❌ Failed to get balance. Please try again.');
      }
    });

    // Transaction history command
    this.bot.command('history', async (ctx) => {
      const telegramId = ctx.from.id.toString();

      try {
        const user = await this.prisma.user.findUnique({
          where: { telegramId },
        });

        if (!user) {
          ctx.reply('❌ Account not linked. Use /link <email> to link your account.');
          return;
        }

        const transactions = await this.prisma.transaction.findMany({
          where: {
            OR: [
              { fromUserId: user.id },
              { toUserId: user.id },
            ],
          },
          include: {
            fromAccount: true,
            toAccount: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        });

        if (transactions.length === 0) {
          ctx.reply('📝 No transactions found.');
          return;
        }

        let message = '📋 Recent Transactions:\n\n';
        transactions.forEach((tx, index) => {
          const isIncoming = tx.toUserId === user.id;
          const direction = isIncoming ? '⬇️ Received' : '⬆️ Sent';
          const account = isIncoming ? tx.fromAccount.accountNumber : tx.toAccount.accountNumber;
          
          message += `${index + 1}. ${direction}\n`;
          message += `   Amount: ${Number(tx.amount).toLocaleString()} UZS\n`;
          message += `   ${isIncoming ? 'From' : 'To'}: ${account}\n`;
          message += `   Status: ${tx.status}\n`;
          message += `   Date: ${tx.createdAt.toLocaleDateString()}\n\n`;
        });

        ctx.reply(message);
      } catch (error) {
        this.logger.error('Error getting history:', error);
        ctx.reply('❌ Failed to get transaction history. Please try again.');
      }
    });

    // Unlink command
    this.bot.command('unlink', async (ctx) => {
      const telegramId = ctx.from.id.toString();

      try {
        const user = await this.prisma.user.findUnique({
          where: { telegramId },
        });

        if (!user) {
          ctx.reply('❌ No linked account found.');
          return;
        }

        await this.prisma.user.update({
          where: { telegramId },
          data: { telegramId: null },
        });

        ctx.reply('✅ Account unlinked successfully.');
      } catch (error) {
        this.logger.error('Error unlinking account:', error);
        ctx.reply('❌ Failed to unlink account. Please try again.');
      }
    });

    // Error handling
    this.bot.catch((err, ctx) => {
      this.logger.error('Bot error:', err);
      ctx.reply('❌ An error occurred. Please try again.');
    });
  }

  async sendTransactionNotification(
    telegramId: string,
    type: 'PENDING' | 'COMPLETED' | 'FAILED' | 'RECEIVED',
    amount: number,
    accountNumber: string,
  ) {
    if (!this.bot || !telegramId) return;

    try {
      let message = '';
      let emoji = '';

      switch (type) {
        case 'PENDING':
          emoji = '⏳';
          message = `${emoji} Transaction Pending\n\nAmount: ${amount.toLocaleString()} UZS\nTo: ${accountNumber}\n\nPlease verify with the code sent to your email.`;
          break;
        case 'COMPLETED':
          emoji = '✅';
          message = `${emoji} Transaction Completed\n\nAmount: ${amount.toLocaleString()} UZS\nTo: ${accountNumber}\n\nTransaction was successful!`;
          break;
        case 'FAILED':
          emoji = '❌';
          message = `${emoji} Transaction Failed\n\nAmount: ${amount.toLocaleString()} UZS\nTo: ${accountNumber}\n\nPlease try again or contact support.`;
          break;
        case 'RECEIVED':
          emoji = '💰';
          message = `${emoji} Money Received\n\nAmount: ${amount.toLocaleString()} UZS\nFrom: ${accountNumber}\n\nYour account has been credited!`;
          break;
      }

      await this.bot.telegram.sendMessage(telegramId, message);
    } catch (error) {
      this.logger.error('Error sending Telegram notification:', error);
    }
  }

  async sendMessage(telegramId: string, message: string) {
    if (!this.bot || !telegramId) return;

    try {
      await this.bot.telegram.sendMessage(telegramId, message);
    } catch (error) {
      this.logger.error('Error sending Telegram message:', error);
    }
  }

  onModuleDestroy() {
    if (this.bot) {
      this.bot.stop();
      this.logger.log('Telegram bot stopped');
    }
  }
}