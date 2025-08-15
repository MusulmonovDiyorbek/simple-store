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
import { MailService } from '../mail/mail.service'; // ✅ yo'l to'g'irlandi

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<{ message: string }> {
    if (password !== confirmPassword) {
      throw new BadRequestException('Parollar bir xil emas');
    }

    const existingUser = await this.usersService.findByEmail(email).catch(() => null);
    if (existingUser) {
      throw new ConflictException('Email allaqachon band');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create(fullName, email, hashedPassword);

    const rawCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(rawCode, 10);

    user.verificationCode = hashedCode;
    user.verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.isVerified = false;
    await this.usersService.save(user); // ✅ save method UsersService'ga qo'shilishi kerak

    await this.mailService.sendVerificationEmail(user.email, rawCode);

    return { message: 'Tasdiqlash kodi emailga yuborildi' };
  }

  async verifyEmail(email: string, code: string): Promise<{ token: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.verificationCode || !user.verificationCodeExpiresAt) {
      throw new BadRequestException('Tasdiqlash kodi topilmadi');
    }

    if (user.verificationCodeExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Kodning amal qilish muddati tugagan');
    }

    const isCodeValid = await bcrypt.compare(code, user.verificationCode);
    if (!isCodeValid) {
      throw new BadRequestException('Kod noto‘g‘ri');
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiresAt = null;
    await this.usersService.save(user); // ✅

    const token = this.generateToken(user);
    return { token };
  }

  async resendCode(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('Foydalanuvchi topilmadi');

    const rawCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(rawCode, 10);

    user.verificationCode = hashedCode;
    user.verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.usersService.save(user); // ✅

    await this.mailService.sendVerificationEmail(user.email, rawCode);

    return { message: 'Yangi tasdiqlash kodi yuborildi' };
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Login yoki parol noto‘g‘ri');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Email tasdiqlanmagan');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Login yoki parol noto‘g‘ri');
    }

    const token = this.generateToken(user);
    return { token };
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
