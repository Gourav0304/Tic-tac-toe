import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust the salt rounds as needed
    const newUser = new this.userModel({ username, email, password: hashedPassword });
    return await newUser.save();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findOne(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({
        email: email,
      })
      .lean();
    return user;
  }
}
