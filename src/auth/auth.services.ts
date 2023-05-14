import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { authDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable({})
export class AuthServices {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signUp(dto: authDto) {
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
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'A user with these details already exists',
          );
        }
      }
      throw error;
    }
  }

  async Login(dto: authDto) {
    const User = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!User) {
      throw new ForbiddenException('Wrong Email or Password');
    }
    const verifyPassword = await argon.verify(User.hash, dto.password);
    if (!verifyPassword) {
      throw new ForbiddenException('Wrong Email or Password!!');
    } else return this.createSignInToken(User.email, User.id);
  }

  async createSignInToken(
    email: string,
    id: number,
  ): Promise<{ token: string }> {
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
}
