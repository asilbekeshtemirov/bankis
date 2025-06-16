import { LanguagesService } from './languages.service';
import { CreateLanguageDto, UpdateLanguageDto, CreateTranslationDto, UpdateTranslationDto } from './dto';
export declare class LanguagesController {
    private readonly languagesService;
    constructor(languagesService: LanguagesService);
    createLanguage(createLanguageDto: CreateLanguageDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
    }>;
    findAllLanguages(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
    }>;
    updateLanguage(id: string, updateLanguageDto: UpdateLanguageDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
    }>;
    removeLanguage(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        code: string;
    }>;
    createTranslation(createTranslationDto: CreateTranslationDto): Promise<{
        language: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
}
