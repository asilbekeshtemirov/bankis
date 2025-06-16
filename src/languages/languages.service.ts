import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLanguageDto, UpdateLanguageDto, CreateTranslationDto, UpdateTranslationDto } from './dto';

@Injectable()
export class LanguagesService {
  constructor(private prisma: PrismaService) {}

  async createLanguage(createLanguageDto: CreateLanguageDto) {
    const { code, name } = createLanguageDto;

    const existingLanguage = await this.prisma.language.findUnique({
      where: { code },
    });

    if (existingLanguage) {
      throw new BadRequestException('Language already exists');
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

  async findOneLanguage(id: string) {
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
      throw new NotFoundException('Language not found');
    }

    return language;
  }

  async updateLanguage(id: string, updateLanguageDto: UpdateLanguageDto) {
    const language = await this.prisma.language.findUnique({
      where: { id },
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    return this.prisma.language.update({
      where: { id },
      data: updateLanguageDto,
    });
  }

  async removeLanguage(id: string) {
    const language = await this.prisma.language.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    if (language._count.users > 0) {
      throw new BadRequestException('Cannot delete language with active users');
    }

    return this.prisma.language.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async createTranslation(createTranslationDto: CreateTranslationDto) {
    const { languageCode, key, value } = createTranslationDto;
  
    const language = await this.prisma.language.findUnique({
      where: { code: languageCode },
    });
  
    if (!language) {
      throw new NotFoundException(`Language with code '${languageCode}' not found`);
    }
  
    const existingTranslation = await this.prisma.translation.findUnique({
      where: {
        languageId_key: { languageId: language.id, key },
      },
    });
  
    if (existingTranslation) {
      throw new BadRequestException('Translation key already exists for this language');
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
  

  async findAllTranslations(languageId?: string) {
    const where: any = {};
    
    if (languageId) {
      where.languageId = languageId;
    }

    return this.prisma.translation.findMany({
      where,
      include: { language: true },
      orderBy: { key: 'asc' },
    });
  }

  async findOneTranslation(id: string) {
    const translation = await this.prisma.translation.findUnique({
      where: { id },
      include: { language: true },
    });

    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    return translation;
  }

  async updateTranslation(id: string, updateTranslationDto: UpdateTranslationDto) {
    const translation = await this.prisma.translation.findUnique({
      where: { id },
    });

    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    return this.prisma.translation.update({
      where: { id },
      data: updateTranslationDto,
      include: { language: true },
    });
  }

  async removeTranslation(id: string) {
    const translation = await this.prisma.translation.findUnique({
      where: { id },
    });

    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    return this.prisma.translation.delete({
      where: { id },
    });
  }

  async getTranslationsByLanguage(languageCode: string) {
    const language = await this.prisma.language.findUnique({
      where: { code: languageCode },
      include: { translations: true },
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    const translations: Record<string, string> = {};
    language.translations.forEach((translation) => {
      translations[translation.key] = translation.value;
    });

    return translations;
  }

  async bulkCreateTranslations(languageId: string, translations: Record<string, string>) {
    const language = await this.prisma.language.findUnique({
      where: { id: languageId },
    });

    if (!language) {
      throw new NotFoundException('Language not found');
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
}