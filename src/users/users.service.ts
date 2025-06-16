import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UpdateProfileDto } from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, firstName, lastName, roleId, languageId } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
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

  async findAll(page: number = 1, limit: number = 10, search?: string, role?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
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

  async findOne(id: string) {
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
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = { ...updateUserDto };

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

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
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

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getUserStats(userId: string) {
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
      throw new NotFoundException('User not found');
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

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  private generateAccountNumber(): string {
    const prefix = '8600';
    const suffix = Math.random().toString().slice(2, 14);
    return prefix + suffix;
  }
}
