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
exports.LanguagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LanguagesService = class LanguagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createLanguage(createLanguageDto) {
        const { code, name } = createLanguageDto;
        const existingLanguage = await this.prisma.language.findUnique({
            where: { code },
        });
        if (existingLanguage) {
            throw new common_1.BadRequestException('Language already exists');
        }
        return this.prisma.language.create({
            data: { code, name },
        });
    }
    async findAllLanguages() {
        return this.prisma.language.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    async findOneLanguage(id) {
        const language = await this.prisma.language.findUnique({
            where: { id },
            include: {
                translations: true,
                _count: {
                    select: { users: true },
                },
            },
        });
        if (!language) {
            throw new common_1.NotFoundException('Language not found');
        }
        return language;
    }
    async updateLanguage(id, updateLanguageDto) {
        const language = await this.prisma.language.findUnique({
            where: { id },
        });
        if (!language) {
            throw new common_1.NotFoundException('Language not found');
        }
        return this.prisma.language.update({
            where: { id },
            data: updateLanguageDto,
        });
    }
    async removeLanguage(id) {
        const language = await this.prisma.language.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { users: true },
                },
            },
        });
        if (!language) {
            throw new common_1.NotFoundException('Language not found');
        }
        if (language._count.users > 0) {
            throw new common_1.BadRequestException('Cannot delete language with active users');
        }
        return this.prisma.language.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async createTranslation(createTranslationDto) {
        const { languageCode, key, value } = createTranslationDto;
        const language = await this.prisma.language.findUnique({
            where: { code: languageCode },
        });
        if (!language) {
            throw new common_1.NotFoundException(`Language with code '${languageCode}' not found`);
        }
        const existingTranslation = await this.prisma.translation.findUnique({
            where: {
                languageId_key: { languageId: language.id, key },
            },
        });
        if (existingTranslation) {
            throw new common_1.BadRequestException('Translation key already exists for this language');
        }
        return this.prisma.translation.create({
            data: {
                languageId: language.id,
                key,
                value,
            },
            include: { language: true },
        });
    }
    async findAllTranslations(languageId) {
        const where = {};
        if (languageId) {
            where.languageId = languageId;
        }
        return this.prisma.translation.findMany({
            where,
            include: { language: true },
            orderBy: { key: 'asc' },
        });
    }
    async findOneTranslation(id) {
        const translation = await this.prisma.translation.findUnique({
            where: { id },
            include: { language: true },
        });
        if (!translation) {
            throw new common_1.NotFoundException('Translation not found');
        }
        return translation;
    }
    async updateTranslation(id, updateTranslationDto) {
        const translation = await this.prisma.translation.findUnique({
            where: { id },
        });
        if (!translation) {
            throw new common_1.NotFoundException('Translation not found');
        }
        return this.prisma.translation.update({
            where: { id },
            data: updateTranslationDto,
            include: { language: true },
        });
    }
    async removeTranslation(id) {
        const translation = await this.prisma.translation.findUnique({
            where: { id },
        });
        if (!translation) {
            throw new common_1.NotFoundException('Translation not found');
        }
        return this.prisma.translation.delete({
            where: { id },
        });
    }
    async getTranslationsByLanguage(languageCode) {
        const language = await this.prisma.language.findUnique({
            where: { code: languageCode },
            include: { translations: true },
        });
        if (!language) {
            throw new common_1.NotFoundException('Language not found');
        }
        const translations = {};
        language.translations.forEach((translation) => {
            translations[translation.key] = translation.value;
        });
        return translations;
    }
    async bulkCreateTranslations(languageId, translations) {
        const language = await this.prisma.language.findUnique({
            where: { id: languageId },
        });
        if (!language) {
            throw new common_1.NotFoundException('Language not found');
        }
        const translationData = Object.entries(translations).map(([key, value]) => ({
            languageId,
            key,
            value,
        }));
        return this.prisma.translation.createMany({
            data: translationData,
            skipDuplicates: true,
        });
    }
};
exports.LanguagesService = LanguagesService;
exports.LanguagesService = LanguagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LanguagesService);
//# sourceMappingURL=languages.service.js.map