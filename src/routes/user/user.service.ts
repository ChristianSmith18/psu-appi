import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entity';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getOneUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async getOneUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('correo = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }
}
