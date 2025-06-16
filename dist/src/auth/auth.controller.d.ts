import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any): Promise<{
        message: string;
        data: {
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
        };
    }>;
    getProfile(req: any): Promise<{
        message: string;
        data: any;
    }>;
}
