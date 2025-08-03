import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import * as Minio from 'minio';
import { memoryStorage } from 'multer';

@Injectable()
export class FileUploadService {
  private minioClient: Minio.Client;
  private bucketName = 'toeic';

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadmin123',
    });
    this.initializeBucket();
  }

  // Initialize bucket if it doesn't exist
  private async initializeBucket() {
    try {
      const bucketExists =
        await this.minioClient.bucketExists(
          this.bucketName,
        );
      if (!bucketExists) {
        await this.minioClient.makeBucket(
          this.bucketName,
          'us-east-1',
        );
        console.log(
          `Bucket ${this.bucketName} created successfully`,
        );
      }

      // Always set bucket policy for public read access
      await this.setBucketPolicy();
    } catch (error) {
      console.error(
        'Error initializing MinIO bucket:',
        error,
      );
    }
  }

  // Set bucket policy for public read access
  private async setBucketPolicy() {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [
            `arn:aws:s3:::${this.bucketName}/*`,
          ],
        },
      ],
    };

    try {
      await this.minioClient.setBucketPolicy(
        this.bucketName,
        JSON.stringify(policy),
      );
      console.log(
        'Bucket policy set for public read access',
      );
    } catch (error) {
      console.error(
        'Error setting bucket policy:',
        error,
      );
    }
  }

  // Manual method to set bucket policy (for testing)
  async setBucketPolicyManually() {
    await this.setBucketPolicy();
  }

  // Configure multer for file uploads (store in memory first)
  static getMulterConfig() {
    return {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        // Accept images and audio files
        if (
          file.mimetype.startsWith('image/') ||
          file.mimetype.startsWith('audio/')
        ) {
          cb(null, true);
        } else {
          cb(
            new Error(
              'Only image and audio files are allowed!',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    };
  }

  // Upload file to MinIO
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<string> {
    const type = file.mimetype.startsWith(
      'image/',
    )
      ? 'images'
      : 'audio';
    const uniqueSuffix =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const fileName = `${type}/${file.fieldname}-${uniqueSuffix}${ext}`;

    try {
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      return fileName;
    } catch (error) {
      console.error(
        'Error uploading file to MinIO:',
        error,
      );
      throw new Error('Failed to upload file');
    }
  }

  // Generate file URL
  generateFileUrl(fileName: string): string {
    return `http://localhost:9000/${this.bucketName}/${fileName}`;
  }

  // Get presigned URL for secure access (optional)
  async getPresignedUrl(
    fileName: string,
  ): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        this.bucketName,
        fileName,
        24 * 60 * 60, // 24 hours expiry
      );
    } catch (error) {
      console.error(
        'Error generating presigned URL:',
        error,
      );
      throw new Error(
        'Failed to generate file URL',
      );
    }
  }

  // Delete file from MinIO
  async deleteFile(
    fileName: string,
  ): Promise<void> {
    try {
      await this.minioClient.removeObject(
        this.bucketName,
        fileName,
      );
    } catch (error) {
      console.error(
        'Error deleting file from MinIO:',
        error,
      );
      throw new Error('Failed to delete file');
    }
  }
}
