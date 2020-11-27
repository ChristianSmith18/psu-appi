import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly _user: UserService,
    private readonly _jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this._user.getOneUserByEmail(email);

    if (user && (await compare(password, user.password))) {
      delete user.password;
      return user;
    }
  }

  async login(user: UserEntity) {
    const { id, ...rest } = user;
    const payload = { sub: id };

    const accessToken = this._jwt.sign(payload);

    return {
      ...rest,
      accessToken,
    };
  }

  async refreshToken(id: number) {
    const payload = { sub: id };
    return this._jwt.sign(payload);
  }
}
