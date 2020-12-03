import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from '../question/dto';
import { CreateAnswerDto, UpdateAnswerDto } from './dto';
import { AnswerEntity } from './entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(AnswerEntity)
    private readonly answerRepository: Repository<AnswerEntity>,
  ) {}

  async getAllAnswers(): Promise<AnswerEntity[]> {
    return await this.answerRepository.find();
  }

  async getOneAnswerById(id: number): Promise<AnswerEntity> {
    if (id !== undefined) return await this.answerRepository.findOne({ id });

    throw new HttpException(
      {
        error: 'Invalid id!',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async createAnswer(
    createAnswerDto: CreateAnswerDto,
    question: CreateQuestionDto,
  ): Promise<AnswerEntity> {
    delete createAnswerDto.id;
    const answer = this.answerRepository.create({
      ...createAnswerDto,
      question,
    });
    delete answer.id;
    return this.answerRepository.save(answer);
  }

  async updateAnswer(updateAnswerDto: UpdateAnswerDto): Promise<AnswerEntity> {
    if (!updateAnswerDto.id)
      throw new HttpException(
        {
          error: 'Id attribute is required!',
        },
        HttpStatus.BAD_REQUEST,
      );

    const updated = await this.answerRepository.update(
      updateAnswerDto.id,
      updateAnswerDto,
    );

    if (updated.affected > 0)
      return await this.answerRepository.findOne(updateAnswerDto.id);

    throw new HttpException(
      {
        error: 'Answer not found!',
      },
      HttpStatus.NOT_FOUND,
    );
  }

  async deleteAnswerById(id: number): Promise<AnswerEntity> {
    const answer = await this.answerRepository.findOne(id);
    if (answer !== undefined) {
      const deleted = await this.answerRepository.delete(id);

      if (deleted.affected > 0) return answer;
    }
    throw new HttpException(
      {
        error: 'Answer not found!',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
