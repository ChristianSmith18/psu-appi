import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiQuery } from '@nestjs/swagger/dist/decorators/api-query.decorator';
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiAcceptedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { QuestionService } from './question.service';
import { Response, Request } from 'express';
import { QuestionDto, QuestionUpDto } from './dto';
import { Difficulty, DifficultyExtra } from './enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnswerService } from '../answer/answer.service';
import { AnswerEntity } from '../answer/entity';
import { AuthGuard } from '@nestjs/passport';
import { decode } from 'jsonwebtoken';
import { UserService } from '../user/user.service';

@ApiTags('Pregunta')
@Controller('question')
export class QuestionController {
  constructor(
    private readonly _question: QuestionService,
    private readonly _answer: AnswerService,
    private readonly _user: UserService,
  ) {}

  @ApiOperation({ summary: 'Se trae todas las preguntas de la base de datos.' })
  @ApiOkResponse({ description: 'Salió todo correcto.' })
  @ApiBadRequestResponse({ description: 'Ocurrió un error inesperado.' })
  @Get()
  async getAllQuestions(@Res() response: Response) {
    try {
      const questions = await this._question.getAllQuestions();

      return response.status(HttpStatus.OK).json({ ok: true, questions });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }

  @ApiOperation({
    summary: 'Se trae una pregunta de la base de datos a través del id.',
  })
  @ApiQuery({
    name: 'id',
    example: 1,
    required: true,
    type: 'number',
    description: 'Id de la pregunta.',
  })
  @ApiOkResponse({ description: 'Salió todo correcto.' })
  @ApiNotFoundResponse({ description: 'No se encontró la pregunta.' })
  @ApiBadRequestResponse({ description: 'Ocurrió un error inesperado.' })
  @Get('one')
  async getOneQuestionById(
    @Res() response: Response,
    @Query('id', new ParseIntPipe()) id: number,
  ) {
    try {
      const question = await this._question.getOneQuestionById(id);
      if (question) {
        return response.status(HttpStatus.OK).json({ ok: true, question });
      } else {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ ok: false, error: 'Question not found!' });
      }
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }

  @ApiOperation({
    summary: 'Se trae el conteo de preguntas con cierto nivel de dificultad.',
  })
  @ApiQuery({
    name: 'difficulty',
    example: 1,
    required: true,
    enum: DifficultyExtra,
    description: 'Dificultad de la pregunta.',
  })
  @ApiOkResponse({ description: 'Salió todo correcto.' })
  @ApiBadRequestResponse({ description: 'Ocurrió un error inesperado.' })
  @Get('count')
  async countDifficulty(
    @Res() response: Response,
    @Query('difficulty') difficulty: Difficulty,
  ) {
    try {
      const count = await this._question.countDifficulty(difficulty);
      return response.status(HttpStatus.OK).json({ ok: true, count });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }

  @ApiOperation({ summary: 'Crea una pregunta en la base de datos.' })
  @ApiCreatedResponse({ description: 'Se creó correctamente.' })
  @ApiUnauthorizedResponse({
    description: 'No tienes los permisos suficientes.',
  })
  @ApiBadRequestResponse({ description: 'Ocurrió un error inesperado.' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('jwt')
  @Post()
  async createQuestion(
    @Req() req: Request,
    @Res() response: Response,
    @Body() bodyDto: QuestionDto,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const { userId } = decode(token) as any;
    try {
      const user = await this._user.getOneUserById(userId);
      if (user.role === 'ADMIN_ROLE') {
        const question = await this._question.createQuestion(
          user,
          bodyDto.question,
        );
        delete question.user;

        const answer = await this._answer.createAnswer(
          bodyDto.answer,
          question,
        );
        delete answer.question;
        question.answer = answer;

        return response.status(HttpStatus.CREATED).json({ ok: true, question });
      }

      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({
          ok: false,
          error: `User ${user.firstname} ${user.lastname} does not have sufficient permissions.`,
        });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }

  @ApiOperation({ summary: 'Actualiza una pregunta en la base de datos.' })
  @ApiAcceptedResponse({ description: 'Se actualizó correctamente.' })
  @ApiBadRequestResponse({ description: 'Ocurrió un error inesperado.' })
  @Put()
  async updateQuestion(
    @Res() response: Response,
    @Body() updateQuestionDto: QuestionUpDto,
  ) {
    try {
      // let question: QuestionEntity;
      // if (updateQuestionDto.question.id) {
      //   question = await this._question.updateQuestion(
      //     updateQuestionDto.question,
      //   );
      // }

      // console.log(updateQuestionDto.answer);
      let answer: AnswerEntity;
      if (updateQuestionDto.answer.id) {
        answer = await this._answer.updateAnswer(updateQuestionDto.answer);
        delete answer.question;
        // question.answer = answer;
      }

      return response.status(HttpStatus.ACCEPTED).json({ ok: true, answer });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }

  @ApiOperation({
    summary: 'Elimina una pregunta en la base de datos a través del id.',
  })
  @ApiQuery({
    name: 'id',
    example: 1,
    required: true,
    type: 'number',
    description: 'Id de la pregunta.',
  })
  @ApiOkResponse({ description: 'Salió todo correcto.' })
  @ApiNotFoundResponse({ description: 'No se encontró la pregunta.' })
  @ApiBadRequestResponse({ description: 'Ocurrió un error inesperado.' })
  @Delete()
  async deleteQuestionById(
    @Res() response: Response,
    @Query('id', new ParseIntPipe()) id: number,
  ) {
    try {
      const question = await this._question.deleteQuestionById(id);

      return response.status(HttpStatus.OK).json({ ok: true, question });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }
}
