import { Controller, Post, Delete, Get, Param } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.wishlistService.findAllByUser(+userId);
  }

  @Post(':userId/:productId')
  add(@Param('userId') userId: string, @Param('productId') productId: string) {
    return this.wishlistService.addToWishlist(+userId, +productId);
  }

  @Delete(':userId/:productId')
  remove(@Param('userId') userId: string, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(+userId, +productId);
  }
}
