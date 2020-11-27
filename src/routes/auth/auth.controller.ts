import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from '@common/decorators';
import { AuthService } from './auth.service';
import { UserEntity } from '../user/entity';
import { Response, Request } from 'express';
import { decode } from 'jsonwebtoken';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly _auth: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Res() response: Response, @User() user: UserEntity) {
    const data = await this._auth.login(user);
    return response
      .status(HttpStatus.ACCEPTED)
      .json({ username: data.email, bearerToken: data.accessToken });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  profile(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const { exp, id } = decode(token) as any;
    const time = Math.round(exp - Date.now() / 1000);

    if (time < 20) {
      return this._auth.refreshToken(id);
    }

    return 'Tienes acceso a la información';
  }
}

// CRUD - usuario
// CRUD - preguntas

// Entity
