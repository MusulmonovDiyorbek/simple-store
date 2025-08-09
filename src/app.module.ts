import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CartModule } from './cart/cart.module'; // ✅ Qo‘shildi

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'your_password', // parolingni o‘zingniki qil
      database: 'simple_store',
      autoLoadEntities: true, // ✅ barcha entity’larni avtomatik yuklaydi
      synchronize: true, // ❗ faqat dev mode’da ishlat
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    WishlistModule,
    CartModule, // ✅ qo‘shildi
  ],
})
export class AppModule {}
