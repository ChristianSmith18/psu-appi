import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { QuestionService } from '../question/question.service';
import { UserService } from '../user/user.service';
import { CreateTestDto } from './dto';

@Injectable()
export class TestService {
  constructor(
    private readonly _user: UserService,
    private readonly _question: QuestionService,
  ) {}

  async generateTest(createTestDto: CreateTestDto) {
    let count = 0;
    let key = true;
    let questionsId = [];
    let questionsTest = [];
    while (key && count <= 1) {
      const user = await this._user.getOneUserById(createTestDto.userId, {
        withQuestions: true,
      });
      if (!user) {
        throw new HttpException(
          {
            error: 'Invalid userId!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const difficulties = {
        veryEasy: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        veryHard: 0,
      };
      const percentages = {
        veryEasy: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        veryHard: 0,
      };
      const quantity = {
        veryEasy: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        veryHard: 0,
      };
      const questions = await this._question.getAllQuestions(
        user.questions || [],
      );

      questions.forEach(item => {
        switch (item.difficulty) {
          case 'VERY EASY':
            difficulties.veryEasy++;
            break;
          case 'EASY':
            difficulties.easy++;
            break;
          case 'MEDIUM':
            difficulties.medium++;
            break;
          case 'HARD':
            difficulties.hard++;
            break;
          case 'VERY HARD':
            difficulties.veryHard++;
            break;
        }
      });
      percentages.veryEasy = difficulties.veryEasy / questions.length;
      percentages.easy = difficulties.easy / questions.length;
      percentages.medium = difficulties.medium / questions.length;
      percentages.hard = difficulties.hard / questions.length;
      percentages.veryHard = difficulties.veryHard / questions.length;

      quantity.veryEasy = Math.round(
        percentages.veryEasy * (createTestDto?.numberOfQuestions || 20),
      );
      quantity.easy = Math.round(
        percentages.easy * (createTestDto?.numberOfQuestions || 20),
      );
      quantity.medium = Math.round(
        percentages.medium * (createTestDto?.numberOfQuestions || 20),
      );
      quantity.hard = Math.round(
        percentages.hard * (createTestDto?.numberOfQuestions || 20),
      );
      quantity.veryHard = Math.ceil(
        percentages.veryHard * (createTestDto?.numberOfQuestions || 20),
      );

      let sum =
        quantity.veryEasy +
        quantity.easy +
        quantity.medium +
        quantity.hard +
        quantity.veryHard;

      while (
        sum > (createTestDto?.numberOfQuestions || 20) &&
        quantity.veryEasy >= 0
      ) {
        quantity.veryEasy--;
        sum--;
      }

      /* Cantidad de preguntas de cada dificultad */
      quantity.veryEasy =
        quantity.veryEasy > difficulties.veryEasy
          ? difficulties.veryEasy
          : quantity.veryEasy;
      quantity.easy =
        quantity.easy > difficulties.easy ? difficulties.easy : quantity.easy;
      quantity.medium =
        quantity.medium > difficulties.medium
          ? difficulties.medium
          : quantity.medium;
      quantity.hard =
        quantity.hard > difficulties.hard ? difficulties.hard : quantity.hard;
      quantity.veryHard =
        quantity.veryHard > difficulties.veryHard
          ? difficulties.veryHard
          : quantity.veryHard;

      let sumTests = 0;
      questionsId = [];
      questionsTest = [];

      for (const key in quantity) {
        sumTests += quantity[`${key}`];
      }

      for (let i = 0; i < questions.length; i++) {
        if (sumTests < 1) {
          break;
        }
        switch (questions[i].difficulty) {
          case 'VERY EASY':
            if (quantity.veryEasy > 0) {
              questionsId.push(questions[i].id);
              questionsTest.push(questions[i]);
              quantity.veryEasy--;
              sumTests--;
            }
            break;
          case 'EASY':
            if (quantity.easy > 0) {
              questionsId.push(questions[i].id);
              questionsTest.push(questions[i]);
              quantity.easy--;
              sumTests--;
            }
            break;
          case 'MEDIUM':
            if (quantity.medium > 0) {
              questionsId.push(questions[i].id);
              questionsTest.push(questions[i]);
              quantity.medium--;
              sumTests--;
            }
            break;
          case 'HARD':
            if (quantity.hard > 0) {
              questionsId.push(questions[i].id);
              questionsTest.push(questions[i]);
              quantity.hard--;
              sumTests--;
            }
            break;
          case 'VERY HARD':
            questionsId.push(questions[i].id);
            questionsTest.push(questions[i]);
            if (quantity.veryHard > 0) {
              quantity.veryHard--;
              sumTests--;
            }
            break;
        }
      }

      user.questions = [...user.questions, ...questionsId];

      if (questionsTest.length < createTestDto.numberOfQuestions) {
        const diff = createTestDto.numberOfQuestions - questionsTest.length;
        user.questions = user.questions.slice(diff);
        count++;
      } else {
        key = false;
      }

      await this._user.updateUser(user);
    }

    return questionsTest;
  }
}
