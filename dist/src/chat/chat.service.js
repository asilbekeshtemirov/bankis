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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatService = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
        this.chatRooms = new Map();
        this.userConnections = new Map();
    }
    async sendMessage(senderId, receiverId, message) {
        if (!senderId || !receiverId) {
            throw new common_1.NotFoundException('Sender ID yoki Receiver ID noto‘g‘ri (yo‘q)');
        }
        const [sender, receiver] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: senderId } }),
            this.prisma.user.findUnique({ where: { id: receiverId } }),
        ]);
        if (!sender || !receiver) {
            throw new common_1.NotFoundException('Yuboruvchi yoki qabul qiluvchi foydalanuvchi topilmadi');
        }
        const chatMessage = {
            id: this.generateId(),
            senderId,
            receiverId,
            message,
            timestamp: new Date(),
            isRead: false,
        };
        const roomId = this.getRoomId(senderId, receiverId);
        if (!this.chatRooms.has(roomId)) {
            this.chatRooms.set(roomId, []);
        }
        this.chatRooms.get(roomId).push(chatMessage);
        return chatMessage;
    }
    async getChatHistory(userId, otherUserId, page = 1, limit = 50) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
    async getUserChats(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const userChats = [];
        for (const [roomId, messages] of this.chatRooms.entries()) {
            const participants = roomId.split('-');
            if (participants.includes(userId)) {
                const lastMessage = messages[messages.length - 1];
                const unreadCount = messages.filter(msg => msg.receiverId === userId && !msg.isRead).length;
                userChats.push({
                    id: roomId,
                    participants,
                    lastMessage,
                    unreadCount,
                });
            }
        }
        return userChats.sort((a, b) => {
            if (!a.lastMessage && !b.lastMessage)
                return 0;
            if (!a.lastMessage)
                return 1;
            if (!b.lastMessage)
                return -1;
            return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
        });
    }
    async markMessagesAsRead(userId, otherUserId) {
        const roomId = this.getRoomId(userId, otherUserId);
        const messages = this.chatRooms.get(roomId) || [];
        messages.forEach(message => {
            if (message.receiverId === userId) {
                message.isRead = true;
            }
        });
    }
    async deleteMessage(messageId, userId) {
        for (const [roomId, messages] of this.chatRooms.entries()) {
            const messageIndex = messages.findIndex(msg => msg.id === messageId);
            if (messageIndex !== -1) {
                const message = messages[messageIndex];
                if (message.senderId !== userId) {
                    throw new common_1.ForbiddenException('You can only delete your own messages');
                }
                messages.splice(messageIndex, 1);
                return;
            }
        }
        throw new common_1.NotFoundException('Message not found');
    }
    async searchMessages(userId, query) {
        const results = [];
        for (const [roomId, messages] of this.chatRooms.entries()) {
            const participants = roomId.split('-');
            if (participants.includes(userId)) {
                const matchingMessages = messages.filter(message => message.message.toLowerCase().includes(query.toLowerCase()));
                results.push(...matchingMessages);
            }
        }
        return results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    getRoomId(userId1, userId2) {
        return [userId1, userId2].sort().join('-');
    }
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map