import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  // 🧑 Foydalanuvchi bilan bog‘lanish
  @ManyToOne(() => User, (user) => user.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // 📦 Mahsulot bilan bog‘lanish
  @ManyToOne(() => Product, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  // 🔢 Miqdor (kamida 1 bo‘lishi kerak)
  @Column({ type: 'int', default: 1 })
  quantity: number;

  // 📅 Qo‘shilgan vaqt
  @CreateDateColumn()
  addedAt: Date;
}
