import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response, Request } from 'express';
import { decode } from 'jsonwebtoken';
import { CreateScoreDto, CreateTestDto } from './dto';
import { TestService } from './test.service';
import { scores } from './scores';
@ApiTags('Test')
@Controller('test')
export class TestController {
  constructor(private readonly _test: TestService) {}

  @ApiOperation({ summary: 'Genera un test.' })
  @ApiCreatedResponse({ description: 'Se generó correctamente.' })
  @ApiUnauthorizedResponse({
    description: 'No tienes los permisos suficientes.',
  })
  @ApiBadRequestResponse({ description: 'Ocurrió un error inesperado.' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('jwt')
  @Post()
  async generateTest(
    @Req() req: Request,
    @Res() response: Response,
    @Body() createTestDto: CreateTestDto,
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const { userId } = decode(token) as any;

      const test = await this._test.generateTest(userId, createTestDto);

      // Agregar los puntajes
      const myScores = [];
      for (let i = 0; i <= test.length; i++) {
        myScores.push(Number(scores[Math.ceil(i * (75 / test.length))]));
      }

      return response
        .status(HttpStatus.CREATED)
        .json({ ok: true, test, scores: myScores });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }

  @ApiOperation({ summary: 'Calcula el puntaje obtenido en el test.' })
  @ApiCreatedResponse({ description: 'Se calculó correctamente.' })
  @ApiBadRequestResponse({ description: 'Ocurrió un error inesperado.' })
  @Post('score')
  async calculateScore(
    @Res() response: Response,
    @Body() createScoreDto: CreateScoreDto,
  ) {
    try {
      if (createScoreDto.total < createScoreDto.correctAnswers) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          ok: false,
          error: '"CorrectAnswer" can\'t be greater than "Total"',
        });
      }

      createScoreDto.total = createScoreDto.total || 20;

      return response.status(HttpStatus.ACCEPTED).json({
        ok: true,
        score: Number(
          scores[
            Math.ceil(
              createScoreDto.correctAnswers * (75 / createScoreDto.total),
            )
          ],
        ),
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }
}
