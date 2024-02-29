// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user?.password) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const { _id, email, username } = user;
        return { _id, email, username };
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, userId: user._id };
    return {
      access_token: this.jwtService.sign(payload, { secret: 'tictaktoe' }),
    };
  }
}
