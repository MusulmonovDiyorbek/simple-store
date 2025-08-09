import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { CartItem } from '../../cart/entities/cart-item.entity'; // 🛒 CartItem qo‘shildi

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

@Column({ type: 'text', nullable: true }) // ✅ null ruxsat berildi
description: string;


  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Category, (category) => category.products, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  category: Category;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlists: Wishlist[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product) // 🛒 Aloqa qo‘shildi
  cartItems: CartItem[];
}
