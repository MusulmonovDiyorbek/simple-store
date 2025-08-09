import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // 🌐 Barcha mahsulotlarni olish (kategoriya bo‘yicha filter bilan)
  async findAll(categoryName?: string): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (categoryName && categoryName.toLowerCase() !== 'all') {
      query.where('LOWER(category.name) = LOWER(:categoryName)', {
        categoryName,
      });
    }

    return query.getMany();
  }

  // 🧾 Bitta mahsulotni ID orqali olish
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // ➕ Yangi mahsulot qo‘shish (faqat admin)
  async create(dto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = this.productRepository.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      image: dto.image,
      category,
    });

    return this.productRepository.save(product);
  }

  // ❌ Mahsulotni o‘chirish
  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.remove(product);
  }

  // 🔁 Bogʻliq mahsulotlar (kategoriya asosida, joriy mahsulotdan tashqari)
  async findRelated(productId: number): Promise<Product[]> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.productRepository.find({
      where: {
        category: { id: product.category.id },
        id: Not(productId),
      },
      take: 4,
      relations: ['category'],
    });
  }
}
