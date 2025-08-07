import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/:id
  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(+id);
  }

  // GET /users
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // POST /users (faqat adminlar ishlatishi kerak, keyinchalik guard qo‘shasiz)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(
      createUserDto.email,
      createUserDto.password,
    );
  }

  // PUT /users/:id
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    const user = await this.usersService.findById(+id);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, updateData);
    return this.usersService.update(user);
  }

  // DELETE /users/:id
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.remove(+id);
    return { message: 'User deleted successfully' };
  }
}
