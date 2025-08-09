import { 
  Controller, 
  Post, 
  Delete, 
  Get, 
  Param, 
  UseGuards, 
  Request, 
  ParseIntPipe 
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Wishlist')
@ApiBearerAuth()
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Foydalanuvchining wishlistini olish' })
  @ApiResponse({ status: 200, description: 'Wishlist muvaffaqiyatli olindi' })
  findAll(@Request() req) {
    return this.wishlistService.findAllByUser(req.user.id);
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Wishlistga mahsulot qo‘shish' })
  @ApiParam({ name: 'productId', type: Number, description: 'Mahsulot ID' })
  @ApiResponse({ status: 201, description: 'Mahsulot wishlistga qo‘shildi' })
  add(@Request() req, @Param('productId', ParseIntPipe) productId: number) {
    return this.wishlistService.addToWishlist(req.user.id, productId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Wishlistdan mahsulotni o‘chirish' })
  @ApiParam({ name: 'productId', type: Number, description: 'Mahsulot ID' })
  @ApiResponse({ status: 200, description: 'Mahsulot wishlistdan o‘chirildi' })
  remove(@Request() req, @Param('productId', ParseIntPipe) productId: number) {
    return this.wishlistService.removeFromWishlist(req.user.id, productId);
  }
}
