import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = 'lunaria',
  ): Promise<string> {
    if (!file) throw new BadRequestException('Aucun fichier fourni');
    if (!file.mimetype.startsWith('image/'))
      throw new BadRequestException('Le fichier doit être une image');
    if (file.size > 5 * 1024 * 1024)
      throw new BadRequestException('Fichier trop lourd (max 5 MB)');

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

  async uploadMultiple(
    files: Express.Multer.File[],
    folder = 'lunaria',
  ): Promise<string[]> {
    return Promise.all(files.map((f) => this.uploadImage(f, folder)));
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
