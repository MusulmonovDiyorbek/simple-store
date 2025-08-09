import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    example: 1,
    description: 'Mahsulot ID raqami',
  })
  @IsNumber({}, { message: 'Mahsulot ID raqami raqam bo‘lishi kerak' })
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Savatga qo‘shiladigan mahsulot miqdori (kamida 1 bo‘lishi kerak)',
    minimum: 1,
  })
  @IsNumber({}, { message: 'Miqdor raqam bo‘lishi kerak' })
  @Min(1, { message: 'Quantity kamida 1 bo‘lishi kerak' })
  quantity: number;
}
