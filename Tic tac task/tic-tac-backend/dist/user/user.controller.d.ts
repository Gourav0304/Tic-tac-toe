import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    signup(username: string, email: string, password: string): Promise<import("./user.model").User | {
        message: string;
    }>;
}
