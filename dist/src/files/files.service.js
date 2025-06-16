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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const uuid_1 = require("uuid");
let FilesService = class FilesService {
    constructor() {
        this.uploadPath = (0, path_1.join)(process.cwd(), 'uploads');
        this.ensureUploadDirectories();
    }
    ensureUploadDirectories() {
        const directories = ['images', 'videos', 'documents'];
        if (!(0, fs_1.existsSync)(this.uploadPath)) {
            (0, fs_1.mkdirSync)(this.uploadPath, { recursive: true });
        }
        directories.forEach(dir => {
            const dirPath = (0, path_1.join)(this.uploadPath, dir);
            if (!(0, fs_1.existsSync)(dirPath)) {
                (0, fs_1.mkdirSync)(dirPath, { recursive: true });
            }
        });
    }
    async uploadFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${(0, uuid_1.v4)()}.${fileExtension}`;
        let subDirectory = 'documents';
        if (file.mimetype.startsWith('image/')) {
            subDirectory = 'images';
        }
        else if (file.mimetype.startsWith('video/')) {
            subDirectory = 'videos';
        }
        const filePath = (0, path_1.join)(this.uploadPath, subDirectory, fileName);
        try {
            (0, fs_1.writeFileSync)(filePath, file.buffer);
            return `/uploads/${subDirectory}/${fileName}`;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to save file');
        }
    }
    async uploadMultipleFiles(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        const uploadPromises = files.map(file => this.uploadFile(file));
        return Promise.all(uploadPromises);
    }
    getFileTypeFromMimetype(mimetype) {
        if (mimetype.startsWith('image/')) {
            return 'image';
        }
        else if (mimetype.startsWith('video/')) {
            return 'video';
        }
        else {
            return 'document';
        }
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FilesService);
//# sourceMappingURL=files.service.js.map