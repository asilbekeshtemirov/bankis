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
export declare class ChatService {
    private prisma;
    private chatRooms;
    private userConnections;
    constructor(prisma: PrismaService);
    sendMessage(senderId: string, receiverId: string, message: string): Promise<ChatMessage>;
    getChatHistory(userId: string, otherUserId: string, page?: number, limit?: number): Promise<ChatMessage[]>;
    getUserChats(userId: string): Promise<ChatRoom[]>;
    markMessagesAsRead(userId: string, otherUserId: string): Promise<void>;
    deleteMessage(messageId: string, userId: string): Promise<void>;
    searchMessages(userId: string, query: string): Promise<ChatMessage[]>;
    private getRoomId;
    private generateId;
}
