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
  @ApiOperation({ summary: 'Foydalanuvchini ro‘yxatdan o‘tkazish (emailga kod yuboriladi)' })
  @ApiResponse({ status: 201, description: 'Kod emailga yuborildi' })
  @ApiResponse({ status: 400, description: 'Validatsiya xatoligi' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.fullName,
      registerDto.email,
      registerDto.password,
      registerDto.confirmPassword,
    );
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Email tasdiqlash kodi tekshirish' })
  @ApiResponse({ status: 200, description: 'Email tasdiqlandi va token qaytarildi' })
  @ApiResponse({ status: 400, description: 'Kod noto‘g‘ri yoki muddati tugagan' })
  verifyEmail(@Body() body: { email: string; code: string }) {
    return this.authService.verifyEmail(body.email, body.code);
  }

  @Post('resend-code')
  @ApiOperation({ summary: 'Email tasdiqlash kodini qayta yuborish' })
  @ApiResponse({ status: 200, description: 'Kod qayta yuborildi' })
  resendCode(@Body() body: { email: string }) {
    return this.authService.resendCode(body.email);
  }

  @Post('login')
  @ApiOperation({ summary: 'Foydalanuvchini tizimga kiritish' })
  @ApiResponse({ status: 200, description: 'Tizimga muvaffaqiyatli kirdi' })
  @ApiResponse({ status: 401, description: 'Login yoki parol noto‘g‘ri yoki email tasdiqlanmagan' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
