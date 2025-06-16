import { ChatService, ChatMessage, ChatRoom } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    sendMessage(user: any, body: {
        receiverId: string;
        message: string;
    }): Promise<ChatMessage>;
    getChatHistory(user: any, otherUserId: string, page?: number, limit?: number): Promise<ChatMessage[]>;
    getUserChats(user: any): Promise<ChatRoom[]>;
    markMessagesAsRead(user: any, otherUserId: string): Promise<{
        message: string;
    }>;
    deleteMessage(user: any, messageId: string): Promise<{
        message: string;
    }>;
    searchMessages(user: any, query: string): Promise<ChatMessage[]>;
}
