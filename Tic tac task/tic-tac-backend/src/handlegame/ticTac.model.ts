import * as mongoose from 'mongoose';

export const GameBoardSchema = new mongoose.Schema(
  {
    gameId: { type: String, required: true },
    userId: { type: String, required: true },
    board: { type: [String], required: true },
    turn: { type: String, required: true },
    result: { type: String, required: true },
    oMovesCount: { type: Number, required: true },
    difficultyLevel: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    complete: { type: Boolean, default: false }, // Added complete field
    winner: { type: String }, // Added winner field
  },
  { timestamps: true },
);

export interface GameBoard extends mongoose.Document {
  gameId: string;
  userId: string;
  board: string[];
  turn: string;
  result: string;
  oMovesCount: number;
  difficultyLevel: string;
  createdAt: Date;
  updatedAt: Date;
  complete: boolean; // Added complete field
  winner?: string; // Added winner field
}
