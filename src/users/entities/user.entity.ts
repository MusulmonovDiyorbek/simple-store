import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: 'admin' | 'user';

  // Email verification status
  @Column({ default: false })
  isVerified: boolean;

  // Email verification code (hashed)
  @Column({ nullable: true, type: 'varchar' })
  verificationCode: string | null;

  // Code expire date
  @Column({ nullable: true, type: 'timestamp' })
  verificationCodeExpiresAt: Date | null;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];
}
