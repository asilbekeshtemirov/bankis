import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { EmailModule } from '../email/email.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [AccountsModule, EmailModule, TelegramModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}