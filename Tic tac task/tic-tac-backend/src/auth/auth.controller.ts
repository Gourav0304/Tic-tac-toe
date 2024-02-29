import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authDto: AuthDto): Promise<any> {
    const user = await this.authService.validateUser(
      authDto.email,
      authDto.password,
    );
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    const token = await this.authService.login(user);
    return { user:{...user,...token} };
  }
}
