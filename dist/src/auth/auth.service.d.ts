import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly usersService;
    private readonly jwtService;
    constructor(prisma: PrismaService, usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            language: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string;
            };
            email: string;
            firstName: string;
            lastName: string;
            id: string;
            phone: string;
            isActive: boolean;
            createdAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            email: string;
            password: string | null;
            firstName: string | null;
            lastName: string | null;
            roleId: string;
            languageId: string;
            id: string;
            googleId: string | null;
            phone: string | null;
            isActive: boolean;
            telegramId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    googleLogin(googleUser: any): Promise<{
        access_token: string;
        user: {
            email: string;
            password: string | null;
            firstName: string | null;
            lastName: string | null;
            roleId: string;
            languageId: string;
            id: string;
            googleId: string | null;
            phone: string | null;
            isActive: boolean;
            telegramId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    validateUser(payload: any): Promise<{
        email: string;
        password: string | null;
        firstName: string | null;
        lastName: string | null;
        roleId: string;
        languageId: string;
        id: string;
        googleId: string | null;
        phone: string | null;
        isActive: boolean;
        telegramId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
