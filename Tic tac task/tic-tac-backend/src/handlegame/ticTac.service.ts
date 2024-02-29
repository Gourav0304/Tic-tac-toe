import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameBoard } from './ticTac.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TicTacToeService {
  private board: string[];
  private turn: string;
  private oMovesCount: number;
  private result: string;

  constructor(
    @InjectModel('GameBoard') private readonly gameBoardModel: Model<GameBoard>,
  ) {
    this.initializeGame();
  }

  private initializeGame() {
    this.board = Array(9).fill('E');
    this.turn = 'X';
    this.oMovesCount = 0;
    this.result = 'still running';
  }

  private async makeAIMove(difficultyLevel): Promise<number> {
    const availableCells = this.emptyCells();

    switch (difficultyLevel) {
      case 'easy':
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        return availableCells[randomIndex];
      case 'medium':
        const playerSymbol = this.turn === 'X' ? 'O' : 'X';

        for (const cellIndex of availableCells) {
          const tempBoard = [...this.board];
          tempBoard[cellIndex] = playerSymbol;
        }

        return availableCells[0];
      case 'hard':
        const playerSymbols = this.turn === 'X' ? 'O' : 'X';

        for (const cellIndex of availableCells) {
          const tempBoard = [...this.board];
          tempBoard[cellIndex] = playerSymbols;
        }

        return availableCells[0];
      default:
        return availableCells[0];
    }
  }

  private async minimax(
    board: string[],
    player: string,
  ): Promise<{ score: number; index: number }> {
    const availableCells = this.emptyCells();

    if (this.isTerminal()) {
      return { score: this.getScore(), index: -1 };
    }

    const moves: { score: number; index: number }[] = [];

    for (const cellIndex of availableCells) {
      const move: { score: number; index: number } = {
        score: 0,
        index: cellIndex,
      };

      board[cellIndex] = player;

      const result = await this.minimax(board, player === 'X' ? 'O' : 'X');
      move.score = result.score;

      board[cellIndex] = 'E';

      moves.push(move);
    }

    let bestMoveIndex = 0;

    if (player === this.turn) {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMoveIndex = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMoveIndex = i;
        }
      }
    }

    return moves[bestMoveIndex];
  }

  private getScore(): number {
    const winningScores = {
      X: 1,
      O: -1,
      draw: 0,
    };

    if (this.result.endsWith('-won')) {
      const winner = this.result.substring(0, 1);
      return winningScores[winner];
    } else {
      return 0;
    }
  }

  private advanceTurn() {
    this.turn = this.turn === 'X' ? 'O' : 'X';
  }

  private emptyCells(): number[] {
    return this.board.reduce((cells, cell, index) => {
      if (cell === 'E') cells.push(index);
      return cells;
    }, []);
  }

  private async isTerminal(): Promise<boolean> {
    const B = this.board;

    for (let i = 0; i <= 6; i += 3) {
      if (B[i] !== 'E' && B[i] === B[i + 1] && B[i + 1] === B[i + 2]) {
        this.result = B[i] + '-won';
        return true;
      }
    }

    for (let i = 0; i <= 2; i++) {
      if (B[i] !== 'E' && B[i] === B[i + 3] && B[i + 3] === B[i + 6]) {
        this.result = B[i] + '-won';
        return true;
      }
    }

    for (let i = 0, j = 4; i <= 2; i += 2, j -= 2) {
      if (B[i] !== 'E' && B[i] === B[i + j] && B[i + j] === B[i + 2 * j]) {
        this.result = B[i] + '-won';
        return true;
      }
    }

    const available = this.emptyCells();
    if (available.length === 0) {
      this.result = 'draw';
      return true;
    } else {
      this.result = 'still running';
      return false;
    }
  }

  async startGame(
    userId: string,
    gameId: string,
    cellIndex: number,
    difficultyLevel: string,
  ) {
    let existingGame;

    if (!gameId) {
      gameId = uuidv4();
      this.initializeGame();
    } else {
      existingGame = await this.gameBoardModel.findOne({
        userId,
        gameId,
      });

      if (existingGame) {
        this.board = existingGame.board;
        this.turn = existingGame.turn;
        this.oMovesCount = existingGame.oMovesCount;
        this.result = existingGame.result;
      } else {
        return {
          status: 'error',
          message: 'Game not found',
        };
      }
    }

    const moveResult = await this.makeMove(cellIndex, difficultyLevel, userId);

    if (!existingGame) {
      const newGame = new this.gameBoardModel({
        gameId,
        userId,
        board: this.board,
        turn: this.turn,
        result: this.result,
        oMovesCount: this.oMovesCount,
        difficultyLevel,
        createdAt: new Date(),
        updatedAt: new Date(),
        complete: moveResult.complete, // Add complete field here
        winner: moveResult.winner, // Add winner field here
      });
      await newGame.save();
    } else {
      existingGame.board = this.board;
      existingGame.turn = this.turn;
      existingGame.result = this.result;
      existingGame.oMovesCount = this.oMovesCount;
      existingGame.difficultyLevel = difficultyLevel;
      existingGame.updatedAt = new Date();
      existingGame.complete = moveResult.complete; // Add complete field here
      existingGame.winner = moveResult.winner; // Add winner field here
      await existingGame.save();
    }

    return {
      status: 'success',
      message: existingGame ? 'Game updated' : 'Game started',
      board: this.board,
      turn: this.turn,
      gameId,
      ...moveResult,
    };
  }

  private async makeMove(
    cellIndex: number,
    difficultyLevel: string,
    userId: string,
  ): Promise<any> {
    if (this.board[cellIndex] === 'E' && this.result === 'still running') {
      this.board[cellIndex] = this.turn;
      if (this.turn === 'O') this.oMovesCount++;
      this.advanceTurn();

      if (!(await this.isTerminal())) {
        const aiMoveIndex = await this.makeAIMove(difficultyLevel);
        this.board[aiMoveIndex] = this.turn;
        if (this.turn === 'O') this.oMovesCount++;
        this.advanceTurn();
      }

      if (!(await this.isTerminal())) {
        return {
          status: 'success',
          message: 'Move successful',
          board: this.board,
          turn: this.turn,
          winner: null,
          complete: false,
          difficultyLevel: difficultyLevel,
        };
      }

      let winner = null;
      if (this.result.endsWith('-won')) {
        winner = this.result.substring(0, 1);
      }

      return {
        status: 'success',
        message: 'Move successful',
        board: this.board,
        turn: this.turn,
        winner: winner,
        complete: true,
        difficultyLevel: difficultyLevel,
      };
    } else {
      return {
        status: 'error',
        message: 'Invalid move',
        board: this.board,
        turn: this.turn,
        winner: null,
        complete: false,
        difficultyLevel: difficultyLevel,
      };
    }
  }
  async getGameBoard(userId: string) {
    const result = await this.gameBoardModel
      .findOne({ userId})
      .sort({ updatedAt: -1 })
      .exec();
    return result;
  }
}
