import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email manzili noto‘g‘ri formatda' })
  email: string;

  @IsString({ message: 'Parol matn bo‘lishi kerak' })
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' })
  password: string;
}
