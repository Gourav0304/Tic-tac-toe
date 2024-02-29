import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      return { message: 'User already exists' };
    }

    const newUser = await this.userService.createUser(
      username,
      email,
      password,
    );
    return newUser;
  }
}
