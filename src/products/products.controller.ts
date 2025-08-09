import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  NotFoundException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Products') // Swagger bo‘lim nomi
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 🔍 Barcha mahsulotlarni olish
  @Get()
  @ApiOperation({ summary: 'Barcha mahsulotlarni olish', description: 'Kategoriyaga ko‘ra filterlash mumkin' })
  @ApiQuery({ name: 'category', required: false, description: 'Kategoriya nomi' })
  @ApiResponse({ status: 200, description: 'Mahsulotlar ro‘yxati qaytariladi' })
  findAll(@Query('category') category?: string) {
    return this.productsService.findAll(category);
  }

  // 🔍 Bitta mahsulotni ID orqali olish
  @Get(':id')
  @ApiOperation({ summary: 'Bitta mahsulotni olish', description: 'Mahsulot ID bo‘yicha topiladi' })
  @ApiParam({ name: 'id', type: Number, description: 'Mahsulot ID' })
  @ApiResponse({ status: 200, description: 'Topilgan mahsulot ma’lumotlari' })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Mahsulot ID ${id} topilmadi`);
    }
    return product;
  }

  // 🔁 Bogʻliq mahsulotlarni olish
  @Get(':id/related')
  @ApiOperation({ summary: 'Bogʻliq mahsulotlarni olish', description: 'O‘xshash mahsulotlarni qaytaradi' })
  @ApiParam({ name: 'id', type: Number, description: 'Mahsulot ID' })
  @ApiResponse({ status: 200, description: 'Bogʻliq mahsulotlar ro‘yxati' })
  findRelated(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findRelated(id);
  }

  // ➕ Yangi mahsulot qo‘shish
  @Post()
  @ApiOperation({ summary: 'Yangi mahsulot qo‘shish' })
  @ApiResponse({ status: 201, description: 'Mahsulot muvaffaqiyatli yaratildi' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  // ❌ Mahsulotni o‘chirish
  @Delete(':id')
  @ApiOperation({ summary: 'Mahsulotni o‘chirish' })
  @ApiParam({ name: 'id', type: Number, description: 'Mahsulot ID' })
  @ApiResponse({ status: 200, description: 'Mahsulot muvaffaqiyatli o‘chirildi' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
