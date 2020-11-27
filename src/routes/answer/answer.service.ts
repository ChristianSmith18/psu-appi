import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto, UpdateQuestionDto } from '../question/dto';
import { AnswerEntity } from './entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(AnswerEntity)
    private readonly answerRepository: Repository<AnswerEntity>,
  ) {}

  async getAllQuestions(): Promise<AnswerEntity[]> {
    return await this.answerRepository.find();
  }

  async getOneQuestionById(id: number): Promise<AnswerEntity> {
    if (id !== undefined) return await this.answerRepository.findOne({ id });

    throw new HttpException(
      {
        error: 'Invalid id!',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<AnswerEntity> {
    if (
      (await this.answerRepository.findOne(createQuestionDto.id)) ===
      undefined
    ) {
      const question = this.answerRepository.create(createQuestionDto);
      return this.answerRepository.save(question);
    }
    throw new HttpException(
      {
        error: 'Question already exists!',
      },
      HttpStatus.CONFLICT,
    );
  }

  async updateQuestion(
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<AnswerEntity> {
    if (!updateQuestionDto.id)
      throw new HttpException(
        {
          error: 'Rut attribute is required!',
        },
        HttpStatus.BAD_REQUEST,
      );

    const updated = await this.answerRepository.update(
      updateQuestionDto.id,
      updateQuestionDto,
    );

    if (updated.affected > 0)
      return await this.answerRepository.findOne(updateQuestionDto.id);

    throw new HttpException(
      {
        error: 'Question not found!',
      },
      HttpStatus.NOT_FOUND,
    );
  }

  async deleteQuestionById(id: number): Promise<AnswerEntity> {
    const question = await this.answerRepository.findOne(id);
    if (question !== undefined) {
      const deleted = await this.answerRepository.delete(id);

      if (deleted.affected > 0) return question;
    }
    throw new HttpException(
      {
        error: 'Question not found!',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
