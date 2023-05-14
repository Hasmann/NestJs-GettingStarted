import { PrismaService } from 'src/prisma/prisma.service';
import { authDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthServices {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    signUp(dto: authDto): Promise<{
        token: string;
    }>;
    Login(dto: authDto): Promise<{
        token: string;
    }>;
    createSignInToken(email: string, id: number): Promise<{
        token: string;
    }>;
}
