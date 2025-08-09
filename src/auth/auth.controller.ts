import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Foydalanuvchini ro‘yxatdan o‘tkazish' })
  @ApiResponse({ status: 201, description: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi' })
  @ApiResponse({ status: 400, description: 'Validatsiya xatoligi' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.fullName,
      registerDto.email,
      registerDto.password,
      registerDto.confirmPassword,
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'Foydalanuvchini tizimga kiritish' })
  @ApiResponse({ status: 200, description: 'Tizimga muvaffaqiyatli kirdi' })
  @ApiResponse({ status: 401, description: 'Login yoki parol noto‘g‘ri' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
