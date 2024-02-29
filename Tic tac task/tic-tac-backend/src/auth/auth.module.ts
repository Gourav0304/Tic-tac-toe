import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/user.model';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from './auth.constant';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ConfigModule.forRoot(),
    UserModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        privateKey: "111111111111111111",
        signOptions: { expiresIn: jwtConstants.expiresIn },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, UserService],
})
export class AuthModule {}
