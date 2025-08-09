import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // 🛒 Cartga mahsulot qo‘shish yoki mavjudini yangilash
  async addToCart(user: User, dto: AddToCartDto): Promise<CartItem> {
    const product = await this.productRepository.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Mahsulot topilmadi');

    let cartItem = await this.cartRepository.findOne({
      where: { user: { id: user.id }, product: { id: dto.productId } },
      relations: ['product', 'user'],
    });

    if (cartItem) {
      cartItem.quantity += dto.quantity;
    } else {
      cartItem = this.cartRepository.create({
        user,
        product,
        quantity: dto.quantity,
      });
    }

    return this.cartRepository.save(cartItem);
  }

  // 📜 Foydalanuvchining cartini olish
  async getUserCart(userId: number): Promise<CartItem[]> {
    return this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  // ➕ Miqdorni oshirish
  async incrementQuantity(user: User, productId: number): Promise<CartItem> {
    const cartItem = await this.cartRepository.findOne({
      where: { user: { id: user.id }, product: { id: productId } },
      relations: ['product'],
    });

    if (!cartItem) throw new NotFoundException('Cartda mahsulot topilmadi');

    cartItem.quantity += 1;
    return this.cartRepository.save(cartItem);
  }

  // ➖ Miqdorni kamaytirish
  async decrementQuantity(user: User, productId: number): Promise<CartItem> {
    const cartItem = await this.cartRepository.findOne({
      where: { user: { id: user.id }, product: { id: productId } },
      relations: ['product'],
    });

    if (!cartItem) throw new NotFoundException('Cartda mahsulot topilmadi');
    if (cartItem.quantity <= 1) throw new BadRequestException('Miqdor 1 dan kichik bo‘lishi mumkin emas');

    cartItem.quantity -= 1;
    return this.cartRepository.save(cartItem);
  }

  // ❌ Bitta itemni o‘chirish
  async removeItem(user: User, productId: number): Promise<void> {
    await this.cartRepository.delete({ user: { id: user.id }, product: { id: productId } });
  }

  // 🗑 Cartni tozalash
  async clearCart(user: User): Promise<void> {
    await this.cartRepository.delete({ user: { id: user.id } });
  }
}
