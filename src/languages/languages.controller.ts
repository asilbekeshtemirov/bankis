import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto, UpdateLanguageDto, CreateTranslationDto, UpdateTranslationDto } from './dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('languages')
@Controller({ path: 'languages', version: '1' })
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  // Language endpoints
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new language (Admin only)' })
  createLanguage(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languagesService.createLanguage(createLanguageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all languages' })
  findAllLanguages() {
    return this.languagesService.findAllLanguages();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get language by ID (Admin only)' })
  findOneLanguage(@Param('id') id: string) {
    return this.languagesService.findOneLanguage(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update language (Admin only)' })
  updateLanguage(@Param('id') id: string, @Body() updateLanguageDto: UpdateLanguageDto) {
    return this.languagesService.updateLanguage(id, updateLanguageDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete language (Admin only)' })
  removeLanguage(@Param('id') id: string) {
    return this.languagesService.removeLanguage(id);
  }

  // Translation endpoints
  @Post('translations')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new translation (Admin only)' })
  createTranslation(@Body() createTranslationDto: CreateTranslationDto) {
    return this.languagesService.createTranslation(createTranslationDto);
  }

  @Get('translations')
  @ApiOperation({ summary: 'Get all translations' })
  @ApiQuery({ name: 'languageId', required: false, type: String })
  findAllTranslations(@Query('languageId') languageId?: string) {
    return this.languagesService.findAllTranslations(languageId);
  }

  @Get('translations/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get translation by ID (Admin only)' })
  findOneTranslation(@Param('id') id: string) {
    return this.languagesService.findOneTranslation(id);
  }

  @Patch('translations/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update translation (Admin only)' })
  updateTranslation(@Param('id') id: string, @Body() updateTranslationDto: UpdateTranslationDto) {
    return this.languagesService.updateTranslation(id, updateTranslationDto);
  }

  @Delete('translations/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete translation (Admin only)' })
  removeTranslation(@Param('id') id: string) {
    return this.languagesService.removeTranslation(id);
  }

  @Get(':languageCode/translations')
  @ApiOperation({ summary: 'Get translations by language code' })
  getTranslationsByLanguage(@Param('languageCode') languageCode: string) {
    return this.languagesService.getTranslationsByLanguage(languageCode);
  }
}