import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { CreateQuestionDto, UpdateQuestionDto } from './dto';
import { QuestionEntity } from './entity';
import { Difficulty } from './enum';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}

  async getAllQuestions(notIds = []): Promise<QuestionEntity[]> {
    if (notIds.length === 0) {
      return this.questionRepository.find({
        join: {
          alias: 'question',
          leftJoinAndSelect: { answer: 'question.answer' },
        },
      });
    }
    return this.questionRepository.find({
      where: { id: Not(In(notIds)) },
      join: {
        alias: 'question',
        leftJoinAndSelect: { answer: 'question.answer' },
      },
      order: { difficultyNumber: 'ASC' },
    });
  }

  async getOneQuestionById(id: number): Promise<QuestionEntity> {
    if (id !== undefined) return await this.questionRepository.findOne({ id });

    throw new HttpException(
      {
        error: 'Invalid id!',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async countDifficulty(difficulty: Difficulty): Promise<number | any> {
    const object = { veryEasy: 0, easy: 0, medium: 0, hard: 0, veryHard: 0 };
    if (
      difficulty !== Difficulty['VERY EASY'] &&
      difficulty !== Difficulty['EASY'] &&
      difficulty !== Difficulty['MEDIUM'] &&
      difficulty !== Difficulty['HARD'] &&
      difficulty !== Difficulty['VERY HARD']
    ) {
      object.veryEasy = await this.questionRepository.count({
        difficulty: Difficulty['VERY EASY'],
      });
      object.easy = await this.questionRepository.count({
        difficulty: Difficulty['EASY'],
      });
      object.medium = await this.questionRepository.count({
        difficulty: Difficulty['MEDIUM'],
      });
      object.hard = await this.questionRepository.count({
        difficulty: Difficulty['HARD'],
      });
      object.veryHard = await this.questionRepository.count({
        difficulty: Difficulty['VERY HARD'],
      });
      return object;
    }
    return this.questionRepository.count({ difficulty });
  }

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionEntity> {
    if (
      (await this.questionRepository.findOne(createQuestionDto.id)) ===
        undefined ||
      createQuestionDto.id === undefined
    ) {
      const newQuestion = this.questionRepository.create(createQuestionDto);
      return await this.questionRepository.save(newQuestion);
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
  ): Promise<QuestionEntity> {
    if (!updateQuestionDto.id)
      throw new HttpException(
        {
          error: 'Id attribute is required!',
        },
        HttpStatus.BAD_REQUEST,
      );

    const updated = await this.questionRepository.update(
      updateQuestionDto.id,
      updateQuestionDto,
    );

    if (updated.affected > 0)
      return await this.questionRepository.findOne(updateQuestionDto.id);

    throw new HttpException(
      {
        error: 'Question not found!',
      },
      HttpStatus.NOT_FOUND,
    );
  }

  async deleteQuestionById(id: number): Promise<QuestionEntity> {
    const question = await this.questionRepository.findOne(id);
    if (question !== undefined) {
      const deleted = await this.questionRepository.delete(id);

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
