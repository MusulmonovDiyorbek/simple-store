import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { CartItem } from '../../cart/entities/cart-item.entity'; // ✅ Qo‘shildi

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // 👤 Foydalanuvchi to‘liq ismi
  @Column({ nullable: true }) // ✅ Eski yozuvlar uchun null ruxsat
  fullName: string;

  // 📧 Email (unikal bo'lishi shart)
  @Column({ unique: true })
  email: string;

  // 🔒 Parol
  @Column()
  password: string;

  // 👮 Roli (user yoki admin), default: user
  @Column({ default: 'user' })
  role: 'admin' | 'user';

  // 💖 Wishlist bilan bog‘lanish
  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist[];

  // 🛒 Cart bilan bog‘lanish
  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[]; // ✅ Qo‘shildi
}
