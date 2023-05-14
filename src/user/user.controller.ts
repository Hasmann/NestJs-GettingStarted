import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class Users {
  constructor() {}

  @Get('/me')
  getMe(@Req() req: Request) {
    return req.user;
  }
}
