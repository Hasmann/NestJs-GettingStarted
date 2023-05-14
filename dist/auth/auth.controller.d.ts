import { AuthServices } from './auth.services';
import { authDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthServices);
    signUp(dto: authDto): Promise<{
        token: string;
    }>;
    signIn(dto: authDto): Promise<{
        token: string;
    }>;
}
