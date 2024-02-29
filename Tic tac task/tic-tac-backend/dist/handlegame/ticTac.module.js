"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicTacModule = void 0;
const common_1 = require("@nestjs/common");
const ticTac_controller_1 = require("./ticTac.controller");
const ticTac_service_1 = require("./ticTac.service");
const mongoose_1 = require("@nestjs/mongoose");
const ticTac_model_1 = require("./ticTac.model");
let TicTacModule = class TicTacModule {
};
exports.TicTacModule = TicTacModule;
exports.TicTacModule = TicTacModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'GameBoard', schema: ticTac_model_1.GameBoardSchema }]),
        ],
        controllers: [ticTac_controller_1.TicTacToeController],
        providers: [ticTac_service_1.TicTacToeService],
    })
], TicTacModule);
//# sourceMappingURL=ticTac.module.js.map