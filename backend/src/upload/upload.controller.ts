import {
  Controller,
  Post,
  Delete,
  Param,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', { storage: undefined })) // mémoire → Cloudinary
  async uploadOne(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadImage(file);
    return { url };
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10, { storage: undefined }))
  async uploadMany(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = await this.uploadService.uploadMultiple(files);
    return { urls };
  }

  @Delete(':publicId')
  deleteImage(@Param('publicId') publicId: string) {
    return this.uploadService.deleteImage(publicId);
  }
}
