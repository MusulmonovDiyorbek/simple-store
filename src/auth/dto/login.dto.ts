import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Foydalanuvchining elektron pochtasi',
  })
  @IsEmail({}, { message: 'Email noto‘g‘ri formatda' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Foydalanuvchining paroli',
  })
  @IsNotEmpty({ message: 'Parol kiritilishi kerak' })
  password: string;
}
