import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get() findAll() {
    return this.servicesService.findAll();
  }
  @Get('featured') findFeatured() {
    return this.servicesService.findFeatured();
  }
  @Get('slug/:slug') findBySlug(@Param('slug') slug: string) {
    return this.servicesService.findBySlug(slug);
  }
  @Get(':id') findById(@Param('id') id: string) {
    return this.servicesService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() data: object) {
    return this.servicesService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: object) {
    return this.servicesService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  archive(@Param('id') id: string) {
    return this.servicesService.archive(id);
  }
}
