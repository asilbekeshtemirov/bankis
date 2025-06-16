import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

@Injectable()
export class ChatService {
  private chatRooms: Map<string, ChatMessage[]> = new Map();
  private userConnections: Map<string, any> = new Map();

  constructor(private prisma: PrismaService) {}

  async sendMessage(senderId: string, receiverId: string, message: string): Promise<ChatMessage> {
    // 1. Kiruvchi ID'larni tekshirish
    if (!senderId || !receiverId) {
      throw new NotFoundException('Sender ID yoki Receiver ID noto‘g‘ri (yo‘q)');
    }
  
    // 2. Foydalanuvchilarni topish (xatolik bo‘lishining oldini olish uchun Promise.all ishlatiladi)
    const [sender, receiver] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: senderId } }),
      this.prisma.user.findUnique({ where: { id: receiverId } }),
    ]);
  
    // 3. Foydalanuvchi mavjud emasligini tekshirish
    if (!sender || !receiver) {
      throw new NotFoundException('Yuboruvchi yoki qabul qiluvchi foydalanuvchi topilmadi');
    }
  
    // 4. Chat xabari obyektini yaratish
    const chatMessage: ChatMessage = {
      id: this.generateId(), // unikal ID generatsiya qilinadi
      senderId,
      receiverId,
      message,
      timestamp: new Date(),
      isRead: false,
    };
  
    // 5. Xona ID'si generatsiya qilinadi (ikkala foydalanuvchi ID'si asosida)
    const roomId = this.getRoomId(senderId, receiverId);
  
    // 6. Agar xona mavjud bo‘lmasa, yaratamiz
    if (!this.chatRooms.has(roomId)) {
      this.chatRooms.set(roomId, []);
    }
  
    // 7. Chat xabarini xonaga qo‘shish
    this.chatRooms.get(roomId).push(chatMessage);
  
    // 8. Yangi yuborilgan xabarni qaytarish
    return chatMessage;
  }
  

  async getChatHistory(userId: string, otherUserId: string, page = 1, limit = 50): Promise<ChatMessage[]> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roomId = this.getRoomId(userId, otherUserId);
    const messages = this.chatRooms.get(roomId) || [];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return messages
      .slice()
      .reverse()
      .slice(startIndex, endIndex);
  }

  async getUserChats(userId: string): Promise<ChatRoom[]> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userChats: ChatRoom[] = [];

    for (const [roomId, messages] of this.chatRooms.entries()) {
      const participants = roomId.split('-');

      if (participants.includes(userId)) {
        const lastMessage = messages[messages.length - 1];
        const unreadCount = messages.filter(msg =>
          msg.receiverId === userId && !msg.isRead
        ).length;

        userChats.push({
          id: roomId,
          participants,
          lastMessage,
          unreadCount,
        });
      }
    }

    return userChats.sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
    });
  }

  async markMessagesAsRead(userId: string, otherUserId: string): Promise<void> {
    const roomId = this.getRoomId(userId, otherUserId);
    const messages = this.chatRooms.get(roomId) || [];

    messages.forEach(message => {
      if (message.receiverId === userId) {
        message.isRead = true;
      }
    });
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    for (const [roomId, messages] of this.chatRooms.entries()) {
      const messageIndex = messages.findIndex(msg => msg.id === messageId);

      if (messageIndex !== -1) {
        const message = messages[messageIndex];

        if (message.senderId !== userId) {
          throw new ForbiddenException('You can only delete your own messages');
        }

        messages.splice(messageIndex, 1);
        return;
      }
    }

    throw new NotFoundException('Message not found');
  }

  async searchMessages(userId: string, query: string): Promise<ChatMessage[]> {
    const results: ChatMessage[] = [];

    for (const [roomId, messages] of this.chatRooms.entries()) {
      const participants = roomId.split('-');

      if (participants.includes(userId)) {
        const matchingMessages = messages.filter(message =>
          message.message.toLowerCase().includes(query.toLowerCase())
        );
        results.push(...matchingMessages);
      }
    }

    return results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private getRoomId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('-');
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
