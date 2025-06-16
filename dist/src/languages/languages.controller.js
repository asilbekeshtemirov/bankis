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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const languages_service_1 = require("./languages.service");
const dto_1 = require("./dto");
const auth_guard_1 = require("../common/guards/auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let LanguagesController = class LanguagesController {
    constructor(languagesService) {
        this.languagesService = languagesService;
    }
    createLanguage(createLanguageDto) {
        return this.languagesService.createLanguage(createLanguageDto);
    }
    findAllLanguages() {
        return this.languagesService.findAllLanguages();
    }
    findOneLanguage(id) {
        return this.languagesService.findOneLanguage(id);
    }
    updateLanguage(id, updateLanguageDto) {
        return this.languagesService.updateLanguage(id, updateLanguageDto);
    }
    removeLanguage(id) {
        return this.languagesService.removeLanguage(id);
    }
    createTranslation(createTranslationDto) {
        return this.languagesService.createTranslation(createTranslationDto);
    }
    findAllTranslations(languageId) {
        return this.languagesService.findAllTranslations(languageId);
    }
    findOneTranslation(id) {
        return this.languagesService.findOneTranslation(id);
    }
    updateTranslation(id, updateTranslationDto) {
        return this.languagesService.updateTranslation(id, updateTranslationDto);
    }
    removeTranslation(id) {
        return this.languagesService.removeTranslation(id);
    }
    getTranslationsByLanguage(languageCode) {
        return this.languagesService.getTranslationsByLanguage(languageCode);
    }
};
exports.LanguagesController = LanguagesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new language (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateLanguageDto]),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "createLanguage", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all languages' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "findAllLanguages", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get language by ID (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "findOneLanguage", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update language (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateLanguageDto]),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "updateLanguage", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete language (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "removeLanguage", null);
__decorate([
    (0, common_1.Post)('translations'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new translation (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTranslationDto]),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "createTranslation", null);
__decorate([
    (0, common_1.Get)('translations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all translations' }),
    (0, swagger_1.ApiQuery)({ name: 'languageId', required: false, type: String }),
    __param(0, (0, common_1.Query)('languageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "findAllTranslations", null);
__decorate([
    (0, common_1.Get)('translations/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get translation by ID (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "findOneTranslation", null);
__decorate([
    (0, common_1.Patch)('translations/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update translation (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateTranslationDto]),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "updateTranslation", null);
__decorate([
    (0, common_1.Delete)('translations/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete translation (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "removeTranslation", null);
__decorate([
    (0, common_1.Get)(':languageCode/translations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get translations by language code' }),
    __param(0, (0, common_1.Param)('languageCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "getTranslationsByLanguage", null);
exports.LanguagesController = LanguagesController = __decorate([
    (0, swagger_1.ApiTags)('languages'),
    (0, common_1.Controller)({ path: 'languages', version: '1' }),
    __metadata("design:paramtypes", [languages_service_1.LanguagesService])
], LanguagesController);
//# sourceMappingURL=languages.controller.js.map