import { PrismaService } from '../prisma/prisma.service';
import { CreateLanguageDto, UpdateLanguageDto, CreateTranslationDto, UpdateTranslationDto } from './dto';
export declare class LanguagesService {
    private prisma;
    constructor(prisma: PrismaService);
    createLanguage(createLanguageDto: CreateLanguageDto): Promise<{
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
    }>;
    findAllLanguages(): Promise<{
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
    }[]>;
    findOneLanguage(id: string): Promise<{
        _count: {
            users: number;
        };
        translations: {
            languageId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            key: string;
            value: string;
        }[];
    } & {
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
    }>;
    updateLanguage(id: string, updateLanguageDto: UpdateLanguageDto): Promise<{
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
    }>;
    removeLanguage(id: string): Promise<{
        name: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
    }>;
    createTranslation(createTranslationDto: CreateTranslationDto): Promise<{
        language: {
            name: string;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
    } & {
        languageId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    }>;
    findAllTranslations(languageId?: string): Promise<({
        language: {
            name: string;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
    } & {
        languageId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    })[]>;
    findOneTranslation(id: string): Promise<{
        language: {
            name: string;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
    } & {
        languageId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    }>;
    updateTranslation(id: string, updateTranslationDto: UpdateTranslationDto): Promise<{
        language: {
            name: string;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        };
    } & {
        languageId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    }>;
    removeTranslation(id: string): Promise<{
        languageId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    }>;
    getTranslationsByLanguage(languageCode: string): Promise<Record<string, string>>;
    bulkCreateTranslations(languageId: string, translations: Record<string, string>): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
