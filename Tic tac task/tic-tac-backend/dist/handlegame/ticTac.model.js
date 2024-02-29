"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameBoardSchema = void 0;
const mongoose = require("mongoose");
exports.GameBoardSchema = new mongoose.Schema({
    gameId: { type: String, required: true },
    userId: { type: String, required: true },
    board: { type: [String], required: true },
    turn: { type: String, required: true },
    result: { type: String, required: true },
    oMovesCount: { type: Number, required: true },
    difficultyLevel: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    complete: { type: Boolean, default: false },
    winner: { type: String },
}, { timestamps: true });
//# sourceMappingURL=ticTac.model.js.map