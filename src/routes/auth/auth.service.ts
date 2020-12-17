import { HttpService, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

import { UserService } from '../user/user.service';
import { RecordEntity, UserEntity } from '../user/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly _user: UserService,
    private readonly _jwt: JwtService,
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    private readonly _http: HttpService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this._user.getOneUserByEmail(email);

    if (user && (await compare(password, user.password))) {
      delete user.password;
      return user;
    }
  }

  async login(user: UserEntity, ip: string) {
    const { id, ...rest } = user;
    const payload = { userId: id };

    const accessToken = this._jwt.sign(payload);

    // Create connection record
    this._http
      .get(
        `${process.env.LOCATION_API_URL}/${ip}?access_key=${process.env.LOCATION_API_KEY}&format=1`,
      )
      .subscribe(async ({ data }) => {
        const location = {
          ip: data.ip,
          continent: data.continent_name,
          country: data.country_name,
          region: data.region_name,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
          language: data.location.languages[0].native,
        };
        const record = this.recordRepository.create({ ...location, user });
        await this.recordRepository.save(record);
      });

    return {
      id,
      ...rest,
      accessToken,
    };
  }

  async refreshToken(id: number) {
    const payload = { sub: id };
    return this._jwt.sign(payload);
  }
}
