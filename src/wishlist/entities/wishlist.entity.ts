import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.wishlist, { eager: false })
  user: User;

  @ManyToOne(() => Product, (product) => product.wishlists, { eager: false })
  product: Product;

  @CreateDateColumn()
  createdAt: Date; // 📅 Qachon qo‘shilganini avtomatik saqlaydi
}
