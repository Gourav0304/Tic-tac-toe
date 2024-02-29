"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicTacToeService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
let TicTacToeService = class TicTacToeService {
    constructor(gameBoardModel) {
        this.gameBoardModel = gameBoardModel;
        this.initializeGame();
    }
    initializeGame() {
        this.board = Array(9).fill('E');
        this.turn = 'X';
        this.oMovesCount = 0;
        this.result = 'still running';
    }
    async makeAIMove(difficultyLevel) {
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
    async minimax(board, player) {
        const availableCells = this.emptyCells();
        if (this.isTerminal()) {
            return { score: this.getScore(), index: -1 };
        }
        const moves = [];
        for (const cellIndex of availableCells) {
            const move = {
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
        }
        else {
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
    getScore() {
        const winningScores = {
            X: 1,
            O: -1,
            draw: 0,
        };
        if (this.result.endsWith('-won')) {
            const winner = this.result.substring(0, 1);
            return winningScores[winner];
        }
        else {
            return 0;
        }
    }
    advanceTurn() {
        this.turn = this.turn === 'X' ? 'O' : 'X';
    }
    emptyCells() {
        return this.board.reduce((cells, cell, index) => {
            if (cell === 'E')
                cells.push(index);
            return cells;
        }, []);
    }
    async isTerminal() {
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
        }
        else {
            this.result = 'still running';
            return false;
        }
    }
    async startGame(userId, gameId, cellIndex, difficultyLevel) {
        let existingGame;
        if (!gameId) {
            gameId = (0, uuid_1.v4)();
            this.initializeGame();
        }
        else {
            existingGame = await this.gameBoardModel.findOne({
                userId,
                gameId,
            });
            if (existingGame) {
                this.board = existingGame.board;
                this.turn = existingGame.turn;
                this.oMovesCount = existingGame.oMovesCount;
                this.result = existingGame.result;
            }
            else {
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
                complete: moveResult.complete,
                winner: moveResult.winner,
            });
            await newGame.save();
        }
        else {
            existingGame.board = this.board;
            existingGame.turn = this.turn;
            existingGame.result = this.result;
            existingGame.oMovesCount = this.oMovesCount;
            existingGame.difficultyLevel = difficultyLevel;
            existingGame.updatedAt = new Date();
            existingGame.complete = moveResult.complete;
            existingGame.winner = moveResult.winner;
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
    async makeMove(cellIndex, difficultyLevel, userId) {
        if (this.board[cellIndex] === 'E' && this.result === 'still running') {
            this.board[cellIndex] = this.turn;
            if (this.turn === 'O')
                this.oMovesCount++;
            this.advanceTurn();
            if (!(await this.isTerminal())) {
                const aiMoveIndex = await this.makeAIMove(difficultyLevel);
                this.board[aiMoveIndex] = this.turn;
                if (this.turn === 'O')
                    this.oMovesCount++;
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
        }
        else {
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
    async getGameBoard(userId) {
        const result = await this.gameBoardModel
            .findOne({ userId })
            .sort({ updatedAt: -1 })
            .exec();
        return result;
    }
};
exports.TicTacToeService = TicTacToeService;
exports.TicTacToeService = TicTacToeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('GameBoard')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TicTacToeService);
//# sourceMappingURL=ticTac.service.js.map