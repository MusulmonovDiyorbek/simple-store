import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Cart')
@ApiBearerAuth() // 🔑 JWT token talab qilinishini ko'rsatadi
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Cartga mahsulot qo‘shish' })
  @ApiResponse({ status: 201, description: 'Mahsulot cartga qo‘shildi' })
  @ApiResponse({ status: 400, description: 'Validatsiya xatoligi yoki mahsulot topilmadi' })
  addToCart(@Request() req, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Foydalanuvchining cartini olish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchining cart ro‘yxati' })
  getMyCart(@Request() req) {
    return this.cartService.getUserCart(req.user.id);
  }

  @Post('increment/:productId')
  @ApiOperation({ summary: 'Mahsulot miqdorini oshirish' })
  @ApiResponse({ status: 200, description: 'Miqdor oshirildi' })
  increment(@Request() req, @Param('productId', ParseIntPipe) productId: number) {
    return this.cartService.incrementQuantity(req.user, productId);
  }

  @Post('decrement/:productId')
  @ApiOperation({ summary: 'Mahsulot miqdorini kamaytirish' })
  @ApiResponse({ status: 200, description: 'Miqdor kamaytirildi' })
  decrement(@Request() req, @Param('productId', ParseIntPipe) productId: number) {
    return this.cartService.decrementQuantity(req.user, productId);
  }

  @Delete('remove/:productId')
  @ApiOperation({ summary: 'Cartdan mahsulotni o‘chirish' })
  @ApiResponse({ status: 200, description: 'Mahsulot o‘chirildi' })
  removeFromCart(@Request() req, @Param('productId', ParseIntPipe) productId: number) {
    return this.cartService.removeItem(req.user, productId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Butun cartni bo‘shatish' })
  @ApiResponse({ status: 200, description: 'Cart tozalandi' })
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user);
  }
}
