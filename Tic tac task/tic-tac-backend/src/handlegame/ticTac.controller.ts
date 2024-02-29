import { Body, Controller, Get,Param,Post } from '@nestjs/common';
import { TicTacToeService } from './ticTac.service';
import { GameBoard } from './ticTac.model';

@Controller('tic-tac-toe')
export class TicTacToeController {
  constructor(private readonly ticTacToeService: TicTacToeService) {}

  @Post('game')
  startGame(
    @Body('userId') userId: string,
    @Body('gameid') gameid: string,
    @Body('cellindex') cellindex: number,
    @Body('difficultylevel') difficultylevel: string,
    ) {
    return this.ticTacToeService.startGame(userId,gameid,cellindex,difficultylevel);
  }

  @Get('getGameBoardData/:userId')
  async getGameBoard(@Param('userId') userId: string) {
    return this.ticTacToeService.getGameBoard(userId);
  }
}