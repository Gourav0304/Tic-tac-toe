import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(authDto: AuthDto): Promise<any>;
}
