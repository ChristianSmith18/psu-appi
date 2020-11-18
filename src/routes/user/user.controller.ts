import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { UserService } from './user.service';
import { CreateUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly _user: UserService) {}

  @Get()
  async getAllUsers(@Res() response: Response) {
    try {
      const users = await this._user.getAllUsers();
      return response.status(HttpStatus.OK).json({ ok: true, users });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }

  @Get(':id')
  async getOneUserById(
    @Res() response: Response,
    @Param('id', new ParseIntPipe()) id: number,
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

  @Post()
  async createUser(
    @Res() response: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      const user = await this._user.createUser(createUserDto);
      delete user.password;
      return response.status(HttpStatus.CREATED).json({ ok: true, user });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }
}
