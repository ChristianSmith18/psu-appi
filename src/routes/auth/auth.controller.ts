import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from '@common/decorators';
import { AuthService } from './auth.service';
import { UserEntity } from '../user/entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly _auth: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@User() user: UserEntity) {
    const data = await this._auth.login(user);
    return { ok: true, data };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  profile() {
    return 'Tienes acceso a la información';
  }
}
