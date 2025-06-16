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
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const files_service_1 = require("./files.service");
const auth_guard_1 = require("../common/guards/auth.guard");
const file_size_validation_pipe_1 = require("../common/pipes/file-size-validation.pipe");
const file_type_validation_pipe_1 = require("../common/pipes/file-type-validation.pipe");
let FilesController = class FilesController {
    constructor(filesService) {
        this.filesService = filesService;
    }
    async uploadFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const filePath = await this.filesService.uploadFile(file);
        return {
            message: 'File uploaded successfully',
            filePath,
            fileType: this.filesService.getFileTypeFromMimetype(file.mimetype),
            originalName: file.originalname,
            size: file.size,
        };
    }
    async uploadMultipleFiles(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('Files are required');
        }
        const filePaths = await this.filesService.uploadMultipleFiles(files);
        return {
            message: 'Files uploaded successfully',
            files: files.map((file, index) => ({
                filePath: filePaths[index],
                fileType: this.filesService.getFileTypeFromMimetype(file.mimetype),
                originalName: file.originalname,
                size: file.size,
            })),
        };
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a single file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    __param(0, (0, common_1.UploadedFile)(new file_size_validation_pipe_1.FileSizeValidationPipe(5 * 1024 * 1024), new file_type_validation_pipe_1.FileTypeValidationPipe(['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf']))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('upload-multiple'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple files' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    __param(0, (0, common_1.UploadedFiles)(new file_size_validation_pipe_1.FileSizeValidationPipe(5 * 1024 * 1024), new file_type_validation_pipe_1.FileTypeValidationPipe(['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf']))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "uploadMultipleFiles", null);
exports.FilesController = FilesController = __decorate([
    (0, swagger_1.ApiTags)('files'),
    (0, common_1.Controller)({ path: 'files', version: '1' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesController);
//# sourceMappingURL=files.controller.js.map