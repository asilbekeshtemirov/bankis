import { FilesService } from './files.service';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    uploadFile(file: Express.Multer.File): Promise<{
        message: string;
        filePath: string;
        fileType: string;
        originalName: string;
        size: number;
    }>;
    uploadMultipleFiles(files: Express.Multer.File[]): Promise<{
        message: string;
        files: {
            filePath: string;
            fileType: string;
            originalName: string;
            size: number;
        }[];
    }>;
}
