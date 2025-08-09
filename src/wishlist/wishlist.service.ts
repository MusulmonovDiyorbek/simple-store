import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // 📜 Foydalanuvchining wishlist’ini olish (oxirgi qo‘shilganlari tepada)
  async findAllByUser(userId: number): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
      order: { createdAt: 'DESC' }, // 🆕 Eng so‘nggi tepada
    });
  }

  // ➕ Wishlist’ga qo‘shish
  async addToWishlist(userId: number, productId: number): Promise<Wishlist> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!user || !product) {
      throw new NotFoundException('User or Product not found');
    }

    const wishlistItem = this.wishlistRepository.create({ user, product });
    return await this.wishlistRepository.save(wishlistItem); // 📅 createdAt avtomatik
  }

  // ❌ Wishlist’dan olib tashlash
  async removeFromWishlist(userId: number, productId: number): Promise<void> {
    await this.wishlistRepository.delete({
      user: { id: userId },
      product: { id: productId },
    });
  }
}
