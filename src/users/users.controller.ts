import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found successfully' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(
      createUserDto.fullName,
      createUserDto.email,
      createUserDto.password,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, updateData);
    return this.usersService.update(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
