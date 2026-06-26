import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../common/schemas/user.schema';
import { SetCartDto } from './dto/cart-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user: UserDocument) {
    return this.cartService.getCart(String(user._id));
  }

  @Put()
  setCart(@CurrentUser() user: UserDocument, @Body() dto: SetCartDto) {
    return this.cartService.setCart(String(user._id), dto.items);
  }

  @Post('merge')
  merge(@CurrentUser() user: UserDocument, @Body() dto: SetCartDto) {
    return this.cartService.merge(String(user._id), dto.items);
  }

  @Delete()
  clear(@CurrentUser() user: UserDocument) {
    return this.cartService.clear(String(user._id));
  }
}
