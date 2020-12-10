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
import { CreateTestDto } from './dto';
import { TestService } from './test.service';

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
      return response.status(HttpStatus.CREATED).json({ ok: true, test });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }
}
