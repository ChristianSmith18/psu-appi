import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getOneUserById(
    id: number,
    options?: { withQuestions: boolean },
  ): Promise<UserEntity> {
    if (options && options.withQuestions) {
      return this.userRepository
        .createQueryBuilder('user')
        .where('id = :id', { id })
        .addSelect('user.questions')
        .getOne();
    }
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

  async updateUser(updateUserDto: UpdateUserDto): Promise<UserEntity> {
    if (!updateUserDto.id)
      throw new HttpException(
        {
          error: 'Id attribute is required!',
        },
        HttpStatus.BAD_REQUEST,
      );

    const updated = await this.userRepository.update(
      updateUserDto.id,
      updateUserDto,
    );

    if (updated.affected > 0)
      return await this.userRepository.findOne(updateUserDto.id);

    throw new HttpException(
      {
        error: 'User not found!',
      },
      HttpStatus.NOT_FOUND,
    );
  }

  async deleteUserById(id: number): Promise<UserEntity> {
    const customer = await this.userRepository.findOne(id);
    if (customer !== undefined) {
      const deleted = await this.userRepository.delete(id);

      if (deleted.affected > 0) return customer;
    }
    throw new HttpException(
      {
        error: 'User not found!',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
