import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpStatus,
  Inject,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';

@ApiTags('Usuario')
@Controller('user')
export class UserController {
  constructor(
    private readonly _user: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly _auth: AuthService,
  ) {}

  @ApiOperation({ summary: 'Se trae todos los usuarios de la base de datos.' })
  @ApiOkResponse({ description: 'Salió todo correcto.' })
  @ApiBadRequestResponse({ description: 'Ocurrió un error inesperado.' })
  @Get()
  async getAllUsers(@Res() response: Response) {
    try {
      const users = await this._user.getAllUsers();
      return response.status(HttpStatus.OK).json({ ok: true, users });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }

  @ApiOperation({
    summary: 'Se trae un usuario de la base de datos a través del id.',
  })
  @ApiQuery({
    name: 'id',
    example: 1,
    required: true,
    type: 'number',
    description: 'Id del usuario.',
  })
  @ApiOkResponse({ description: 'Salió todo correcto.' })
  @ApiNotFoundResponse({ description: 'No se encontró la pregunta.' })
  @ApiBadRequestResponse({ description: 'Ocurrió un error inesperado.' })
  @Get('one')
  async getOneUserById(
    @Res() response: Response,
    @Query('id', new ParseIntPipe()) id: number,
  ) {
    try {
      const user = await this._user.getOneUserById(id);
      if (user) {
        return response.status(HttpStatus.OK).json({ ok: true, user });
      }
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ ok: false, error: 'User does not exist!' });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }

  @ApiOperation({ summary: 'Crea un usuario en la base de datos.' })
  @ApiCreatedResponse({ description: 'Se creó correctamente.' })
  @ApiBadRequestResponse({ description: 'Ocurrió un error inesperado.' })
  @Post()
  async createUser(
    @Res() response: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      const user = await this._user.createUser(createUserDto);
      const data = await this._auth.login(user);
      // delete user.password;
      // console.log(data);
      return response.status(HttpStatus.CREATED).json({
        ok: true,
        data: {
          name: `${data.firstname} ${data.lastname}`,
          accessToken: data.accessToken,
        },
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }

  @ApiOperation({ summary: 'Actualiza un usuario en la base de datos.' })
  @ApiAcceptedResponse({ description: 'Se actualizó correctamente.' })
  @ApiBadRequestResponse({ description: 'Ocurrió un error inesperado.' })
  @Put()
  async updateUser(
    @Res() response: Response,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this._user.updateUser(updateUserDto);

      return response.status(HttpStatus.ACCEPTED).json({ ok: true, user });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }

  @ApiOperation({
    summary: 'Elimina un usuario en la base de datos a través del id.',
  })
  @ApiQuery({
    name: 'id',
    example: 12345678,
    required: true,
    type: 'number',
    description: 'Id del cliente.',
  })
  @ApiOkResponse({ description: 'Salió todo correcto.' })
  @ApiNotFoundResponse({ description: 'No se encontró el cliente.' })
  @ApiBadRequestResponse({ description: 'Ocurrió un error inesperado.' })
  @Delete()
  async deleteUserById(
    @Res() response: Response,
    @Query('id', new ParseIntPipe()) id: number,
  ) {
    try {
      const user = await this._user.deleteUserById(id);

      return response.status(HttpStatus.OK).json({ ok: true, user });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }
}
