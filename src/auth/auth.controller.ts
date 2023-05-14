import { Body, Controller, Post } from '@nestjs/common';

import { AuthServices } from './auth.services';
import { authDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthServices) {}

  @Post('/signUp')
  signUp(@Body() dto: authDto) {
    return this.authService.signUp(dto);
  }
  @Post('/signIn')
  signIn(@Body() dto: authDto) {
    return this.authService.Login(dto);
  }
}
