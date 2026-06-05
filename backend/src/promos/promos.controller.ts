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
import { PromosService } from './promos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../common/schemas/user.schema';

@Controller('promos')
export class PromosController {
  constructor(private promosService: PromosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('validate')
  validate(
    @CurrentUser() user: UserDocument,
    @Body() body: { code: string; orderAmount: number },
  ) {
    return this.promosService.validate(
      body.code,
      body.orderAmount,
      String(user._id),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.promosService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() data: object) {
    return this.promosService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: object) {
    return this.promosService.update(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promosService.remove(id);
  }
}
