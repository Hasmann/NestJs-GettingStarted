import { Module } from '@nestjs/common';
import { Users } from './user.controller';

@Module({
  controllers: [Users],
})
export class UserModule {}
