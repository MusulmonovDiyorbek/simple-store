import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 14 Pro', description: 'Mahsulot nomi' })
  @IsString()
  @IsNotEmpty({ message: 'Mahsulot nomi bo‘sh bo‘lishi mumkin emas' })
  name: string;

  @ApiProperty({ example: 'Yangi avlod smartfoni', description: 'Mahsulot tavsifi' })
  @IsString()
  @IsNotEmpty({ message: 'Mahsulot tavsifi bo‘sh bo‘lishi mumkin emas' })
  description: string;

  @ApiProperty({ example: 1299, description: 'Mahsulot narxi' })
  @IsNumber({}, { message: 'Narx raqam bo‘lishi kerak' })
  price: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg', description: 'Mahsulot rasmi URL' })
  @IsOptional()
  @IsString({ message: 'Rasm URL matn ko‘rinishida bo‘lishi kerak' })
  image?: string;

  @ApiProperty({ example: 3, description: 'Kategoriya ID' })
  @IsNumber({}, { message: 'Kategoriya ID raqam bo‘lishi kerak' })
  categoryId: number;
}
