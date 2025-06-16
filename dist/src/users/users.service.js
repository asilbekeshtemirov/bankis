"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const { email, password, firstName, lastName, roleId, languageId } = createUserDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists');
        }
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                roleId,
                languageId,
            },
            include: {
                role: true,
                language: true,
                accounts: true,
            },
        });
        if (user.role.name === 'USER') {
            const accountNumber = this.generateAccountNumber();
            await this.prisma.account.create({
                data: {
                    accountNumber,
                    balance: 0,
                    userId: user.id,
                },
            });
        }
        return user;
    }
    async findAll(page = 1, limit = 10, search, role) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (role) {
            where.role = { name: role };
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                include: {
                    role: true,
                    language: true,
                    accounts: true,
                    _count: {
                        select: {
                            transfersFrom: true,
                            transfersTo: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                role: true,
                language: true,
                accounts: true,
                transfersFrom: {
                    include: {
                        toAccount: true,
                        toUser: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                transfersTo: {
                    include: {
                        fromAccount: true,
                        fromUser: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const updateData = { ...updateUserDto };
        if (updateUserDto.password) {
            updateData.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        return this.prisma.user.update({
            where: { id },
            data: updateData,
            include: {
                role: true,
                language: true,
                accounts: true,
            },
        });
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: updateProfileDto,
            include: {
                role: true,
                language: true,
                accounts: true,
            },
        });
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.prisma.user.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async getUserStats(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                accounts: true,
                _count: {
                    select: {
                        transfersFrom: true,
                        transfersTo: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const totalBalance = user.accounts.reduce((sum, account) => sum + Number(account.balance), 0);
        return {
            totalAccounts: user.accounts.length,
            totalBalance,
            totalTransfersSent: user._count.transfersFrom,
            totalTransfersReceived: user._count.transfersTo,
            totalTransfers: user._count.transfersFrom + user._count.transfersTo,
        };
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    generateAccountNumber() {
        const prefix = '8600';
        const suffix = Math.random().toString().slice(2, 14);
        return prefix + suffix;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map