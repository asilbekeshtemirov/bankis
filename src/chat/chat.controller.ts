import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ChatService, ChatMessage, ChatRoom } from './chat.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('chat')
@Controller({ path: 'chat', version: '1' })
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  async sendMessage(
    @CurrentUser() user: any,
    @Body() body: { receiverId: string; message: string },
  ): Promise<ChatMessage> {
    return this.chatService.sendMessage(user.sub, body.receiverId, body.message);
  }

  @Get('history/:otherUserId')
  @ApiOperation({ summary: 'Get chat history with another user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getChatHistory(
    @CurrentUser() user: any,
    @Param('otherUserId') otherUserId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<ChatMessage[]> {
    return this.chatService.getChatHistory(user.sub, otherUserId, page, limit);
  }

  @Get('rooms')
  @ApiOperation({ summary: 'Get user chat rooms' })
  async getUserChats(@CurrentUser() user: any): Promise<ChatRoom[]> {
    return this.chatService.getUserChats(user.sub);
  }

  @Post('mark-read/:otherUserId')
  @ApiOperation({ summary: 'Mark messages as read' })
  async markMessagesAsRead(
    @CurrentUser() user: any,
    @Param('otherUserId') otherUserId: string,
  ) {
    await this.chatService.markMessagesAsRead(user.sub, otherUserId);
    return { message: 'Messages marked as read' };
  }

  @Delete('message/:messageId')
  @ApiOperation({ summary: 'Delete a message' })
  async deleteMessage(
    @CurrentUser() user: any,
    @Param('messageId') messageId: string,
  ) {
    await this.chatService.deleteMessage(messageId, user.sub);
    return { message: 'Message deleted successfully' };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search messages' })
  @ApiQuery({ name: 'q', required: true, type: String })
  async searchMessages(
    @CurrentUser() user: any,
    @Query('q') query: string,
  ): Promise<ChatMessage[]> {
    return this.chatService.searchMessages(user.sub, query);
  }
}
