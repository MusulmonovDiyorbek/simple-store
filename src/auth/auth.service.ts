import {
  Injectable,
  UnauthorizedException,
  ConflictException,
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
  async register(email: string, password: string): Promise<{ token: string }> {
    // Email bandligini tekshir
    let existingUser: User | null = null;
    try {
      existingUser = await this.usersService.findByEmail(email);
    } catch (error) {
      existingUser = null;
    }

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Parolni hashla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Foydalanuvchini yarat
    const user = await this.usersService.create(email, hashedPassword);

    // Token yarat
    const token = this.generateToken(user);
    return { token };
  }

  // 📌 Login qilish
  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { token };
  }

  // 📌 Token generatsiyasi (role qo‘shilgan)
  private generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role, // Token ichida foydalanuvchining roli bor
    });
  }
}
