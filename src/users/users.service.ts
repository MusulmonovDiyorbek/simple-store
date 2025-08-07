import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 📌 Email bo‘yicha foydalanuvchini topish
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }
    return user;
  }

  // 📌 ID bo‘yicha foydalanuvchini topish
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // 📌 Yangi foydalanuvchi yaratish (default role = 'user')
  async create(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({
      email,
      password,
      role: 'user', // yoki 'admin'
    });

    return this.userRepository.save(user);
  }

  // 🔁 Foydalanuvchini yangilash
  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  // ❌ Foydalanuvchini o‘chirish
  async remove(id: number): Promise<void> {
    const user = await this.findById(id); // mavjudligini tekshiramiz
    await this.userRepository.remove(user);
  }

  // 🔍 Barcha foydalanuvchilarni olish
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
