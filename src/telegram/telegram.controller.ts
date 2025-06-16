import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TelegramService } from './telegram.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('telegram')
@Controller({ path: 'telegram', version: '1' })
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('send-message')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Send message via Telegram bot (Admin only)' })
  async sendMessage(@Body() body: { telegramId: string; message: string }) {
    await this.telegramService.sendMessage(body.telegramId, body.message);
    return { message: 'Message sent successfully' };
  }
}