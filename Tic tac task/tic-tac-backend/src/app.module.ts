import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TicTacModule } from './handlegame/ticTac.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UserModule,
    AuthModule,
    TicTacModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
