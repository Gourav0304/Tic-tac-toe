/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { GameBoard } from './ticTac.model';
export declare class TicTacToeService {
    private readonly gameBoardModel;
    private board;
    private turn;
    private oMovesCount;
    private result;
    constructor(gameBoardModel: Model<GameBoard>);
    private initializeGame;
    private makeAIMove;
    private minimax;
    private getScore;
    private advanceTurn;
    private emptyCells;
    private isTerminal;
    startGame(userId: string, gameId: string, cellIndex: number, difficultyLevel: string): Promise<any>;
    private makeMove;
    getGameBoard(userId: string): Promise<import("mongoose").Document<unknown, {}, GameBoard> & GameBoard & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
