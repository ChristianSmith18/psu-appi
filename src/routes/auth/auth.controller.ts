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
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import * as publicIp from 'public-ip';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly _auth: AuthService) {}

  @ApiOperation({ summary: 'Genera un token de inicio de sesión al usuario.' })
  @ApiBody({
    schema: {
      default: {
        email: 'ejemplo@ejemplo.com',
        password: '12345678',
      },
    },
  })
  @ApiAcceptedResponse({ description: 'Se generó correctamente.' })
  @ApiUnauthorizedResponse({
    description: 'Email y/o contraseña no coinciden para generar el token.',
  })
  @ApiBadRequestResponse({ description: 'Ocurrió un error inesperado.' })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Res() response: Response, @User() user: UserEntity) {
    const ip = await publicIp.v4();
    const data = await this._auth.login(user, ip);

    return response.status(HttpStatus.ACCEPTED).json({
      ok: true,
      data: {
        name: `${data.firstname} ${data.lastname}`,
        accessToken: data.accessToken,
      },
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  profile(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const { exp, userId } = decode(token) as any;

    const time = Math.round(exp - Date.now() / 1000);

    if (time < 20) {
      return this._auth.refreshToken(userId);
    }

    return 'Tienes acceso a la información';
  }
}
