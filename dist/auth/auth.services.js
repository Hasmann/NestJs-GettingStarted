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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const library_1 = require("@prisma/client/runtime/library");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthServices = class AuthServices {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async signUp(dto) {
        try {
            const hash = await argon.hash(dto.password);
            const User = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            });
            delete User.hash;
            return this.createSignInToken(User.email, User.id);
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException('A user with these details already exists');
                }
            }
            throw error;
        }
    }
    async Login(dto) {
        const User = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!User) {
            throw new common_1.ForbiddenException('Wrong Email or Password');
        }
        const verifyPassword = await argon.verify(User.hash, dto.password);
        if (!verifyPassword) {
            throw new common_1.ForbiddenException('Wrong Email or Password!!');
        }
        else
            return this.createSignInToken(User.email, User.id);
    }
    async createSignInToken(email, id) {
        const payload = {
            email,
            id,
        };
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET'),
        });
        return { token: token };
    }
};
AuthServices = __decorate([
    (0, common_1.Injectable)({}),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthServices);
exports.AuthServices = AuthServices;
//# sourceMappingURL=auth.services.js.map