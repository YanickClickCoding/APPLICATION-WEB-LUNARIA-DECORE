import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';

// Placeholders qu'on ne doit jamais considérer comme de vraies clés
const PLACEHOLDERS = new Set([
  '',
  'your_cloud_name',
  'your_api_key',
  'your_api_secret',
  'dxy12abcd',
  '123456789012345',
  'aBcD_efGhIjKlMnOpQrStUvWxYz',
]);

const UPLOAD_DIR = join(process.cwd(), 'uploads');

@Injectable()
export class UploadService {
  private readonly cloudinaryEnabled: boolean;

  constructor(private config: ConfigService) {
    const name = this.config.get<string>('CLOUDINARY_CLOUD_NAME');
    const key = this.config.get<string>('CLOUDINARY_API_KEY');
    const secret = this.config.get<string>('CLOUDINARY_API_SECRET');

    this.cloudinaryEnabled =
      !!name &&
      !!key &&
      !!secret &&
      !PLACEHOLDERS.has(name) &&
      !PLACEHOLDERS.has(key) &&
      !PLACEHOLDERS.has(secret);

    if (this.cloudinaryEnabled) {
      cloudinary.config({ cloud_name: name, api_key: key, api_secret: secret });
    } else {
      // Stockage local : on s'assure que le dossier existe
      fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(() => undefined);
    }
  }

  private validate(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Aucun fichier fourni');
    if (!file.mimetype.startsWith('image/'))
      throw new BadRequestException('Le fichier doit être une image');
    if (file.size > 5 * 1024 * 1024)
      throw new BadRequestException('Fichier trop lourd (max 5 MB)');
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = 'lunaria',
  ): Promise<string> {
    this.validate(file);
    return this.cloudinaryEnabled
      ? this.uploadToCloudinary(file, folder)
      : this.uploadToDisk(file);
  }

  private uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [
            {
              width: 1200,
              height: 1200,
              crop: 'limit',
              quality: 'auto:good',
              fetch_format: 'auto',
            },
          ],
        },
        (err, result: UploadApiResponse) => {
          if (err) reject(err);
          else resolve(result.secure_url);
        },
      );
      const readable = Readable.from(file.buffer);
      readable.pipe(uploadStream);
    });
  }

  private async uploadToDisk(file: Express.Multer.File): Promise<string> {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const ext = extname(file.originalname) || '.jpg';
    const filename = `${randomUUID()}${ext}`;
    await fs.writeFile(join(UPLOAD_DIR, filename), file.buffer);
    // URL relative servie en statique par main.ts (voir useStaticAssets)
    return `/uploads/${filename}`;
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    folder = 'lunaria',
  ): Promise<string[]> {
    return Promise.all(files.map((f) => this.uploadImage(f, folder)));
  }

  async deleteImage(publicId: string): Promise<void> {
    if (this.cloudinaryEnabled) {
      await cloudinary.uploader.destroy(publicId);
    } else {
      await fs.unlink(join(UPLOAD_DIR, publicId)).catch(() => undefined);
    }
  }
}
