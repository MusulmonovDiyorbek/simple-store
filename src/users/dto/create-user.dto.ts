import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsNotEmpty({ message: 'Confirm password is required' })
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
