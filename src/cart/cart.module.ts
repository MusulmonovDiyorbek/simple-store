import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity'; // ✅ qo‘shildi

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Product, User])], // ✅ User qo‘shildi
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService], // ✅ agar boshqa modul ishlatsa
})
export class CartModule {}
