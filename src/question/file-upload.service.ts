import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';

@Injectable()
export class FileUploadService {
  // Configure multer for file uploads
  static getMulterConfig() {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = file.mimetype.startsWith('image/') 
            ? './public/images' 
            : './public/audio';
          
          // Create directory if it doesn't exist
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Accept images and audio files
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image and audio files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    };
  }

  // Generate file URL
  generateFileUrl(filename: string, type: 'image' | 'audio'): string {
    return `http://localhost:3333/${type}s/${filename}`;
  }
}
