"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const mongoose_1 = require("@nestjs/mongoose");
const user_model_1 = require("../user/user.model");
const jwt_1 = require("@nestjs/jwt");
const user_module_1 = require("../user/user.module");
const user_service_1 = require("../user/user.service");
const auth_constant_1 = require("./auth.constant");
const config_1 = require("@nestjs/config");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'User', schema: user_model_1.UserSchema }]),
            config_1.ConfigModule.forRoot(),
            user_module_1.UserModule,
            jwt_1.JwtModule.registerAsync({
                useFactory: async () => ({
                    privateKey: "111111111111111111",
                    signOptions: { expiresIn: auth_constant_1.jwtConstants.expiresIn },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_1.JwtService, user_service_1.UserService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map