export declare class FilesService {
    private readonly uploadPath;
    constructor();
    private ensureUploadDirectories;
    uploadFile(file: Express.Multer.File): Promise<string>;
    uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]>;
    getFileTypeFromMimetype(mimetype: string): string;
}
