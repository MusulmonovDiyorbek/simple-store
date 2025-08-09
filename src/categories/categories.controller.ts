import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Categories') // 🔹 Swagger'da bo'lim nomi
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha kategoriyalarni olish' })
  @ApiResponse({ status: 200, description: 'Kategoriyalar ro‘yxati qaytarildi' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta kategoriya olish' })
  @ApiResponse({ status: 200, description: 'Kategoriya topildi' })
  @ApiResponse({ status: 404, description: 'Kategoriya topilmadi' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi kategoriya yaratish' })
  @ApiResponse({ status: 201, description: 'Kategoriya yaratildi' })
  create(@Body('name') name: string) {
    return this.categoriesService.create(name);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Kategoriyani o‘chirish' })
  @ApiResponse({ status: 200, description: 'Kategoriya o‘chirildi' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
