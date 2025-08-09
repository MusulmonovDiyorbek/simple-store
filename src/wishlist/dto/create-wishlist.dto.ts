import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWishlistDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNumber({}, { message: 'Foydalanuvchi ID raqam bo‘lishi kerak' })
  @Min(1, { message: 'User ID 1 yoki undan katta bo‘lishi kerak' })
  userId: number;

  @ApiProperty({ example: 10, description: 'Product ID' })
  @IsNumber({}, { message: 'Mahsulot ID raqam bo‘lishi kerak' })
  @Min(1, { message: 'Product ID 1 yoki undan katta bo‘lishi kerak' })
  productId: number;
}
