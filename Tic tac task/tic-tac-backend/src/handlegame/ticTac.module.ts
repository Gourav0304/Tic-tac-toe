import { Module } from '@nestjs/common';
import { TicTacToeController } from './ticTac.controller';
import { TicTacToeService } from './ticTac.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GameBoardSchema } from './ticTac.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'GameBoard', schema: GameBoardSchema }]),
  ],
  controllers: [TicTacToeController],
  providers: [TicTacToeService],
})
export class TicTacModule {}
