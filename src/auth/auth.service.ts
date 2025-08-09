import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 📌 Ro‘yxatdan o‘tkazish
  async register(
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<{ token: string }> {
    // 1. Parollar bir xil bo‘lmasa, xatolik
    if (password !== confirmPassword) {
      throw new BadRequestException('Parollar bir xil emas');
    }

    // 2. Email bandligini tekshir
    let existingUser: User | null = null;
    try {
      existingUser = await this.usersService.findByEmail(email);
    } catch (error) {
      existingUser = null;
    }

    if (existingUser) {
      throw new ConflictException('Email allaqachon band');
    }

    // 3. Parolni hashla
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Foydalanuvchini yarat
    const user = await this.usersService.create(fullName, email, hashedPassword);

    // 5. Token yarat
    const token = this.generateToken(user);
    return { token };
  }

  // 📌 Login qilish
  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Login yoki parol noto‘g‘ri');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Login yoki parol noto‘g‘ri');
    }

    const token = this.generateToken(user);
    return { token };
  }

  // 📌 Token generatsiyasi
  private generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
