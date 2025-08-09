import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Foydalanuvchining to‘liq ismi',
  })
  @IsNotEmpty({ message: 'To‘liq ism majburiy' })
  fullName: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Foydalanuvchining elektron pochtasi',
  })
  @IsEmail({}, { message: 'Email noto‘g‘ri formatda' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Foydalanuvchining paroli (kamida 6 belgidan iborat)',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Parol kiritilishi kerak' })
  @MinLength(6, { message: 'Parol kamida 6 belgidan iborat bo‘lishi kerak' })
  password: string;

  @ApiProperty({
    example: 'password123',
    description: 'Parolni tasdiqlash',
  })
  @IsNotEmpty({ message: 'Parolni tasdiqlash majburiy' })
  confirmPassword: string;
}
