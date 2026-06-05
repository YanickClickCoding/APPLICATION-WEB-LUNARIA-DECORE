import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../common/schemas/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ─── Profil du client connecté ───────────────────────────────
  @Patch('me')
  updateMe(@CurrentUser() user: UserDocument, @Body() data: object) {
    return this.usersService.update(String(user._id), data);
  }

  @Patch('me/favorites/:productId')
  addFavorite(
    @CurrentUser() user: UserDocument,
    @Param('productId') pid: string,
  ) {
    return this.usersService.addFavorite(String(user._id), pid);
  }

  @Delete('me/favorites/:productId')
  removeFavorite(
    @CurrentUser() user: UserDocument,
    @Param('productId') pid: string,
  ) {
    return this.usersService.removeFavorite(String(user._id), pid);
  }

  // ─── Admin ────────────────────────────────────────────────────
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.usersService.findAll(page, limit);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/toggle')
  toggleActive(@Param('id') id: string) {
    return this.usersService.toggleActive(id);
  }
}
