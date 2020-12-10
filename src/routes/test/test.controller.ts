import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateTestDto } from './dto';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly _test: TestService) {}

  @Post()
  async generateTest(
    @Res() response: Response,
    @Body() createTestDto: CreateTestDto,
  ) {
    try {
      const test = await this._test.generateTest(createTestDto);
      return response.status(HttpStatus.CREATED).json({ ok: true, test });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({ ok: false, error });
    }
  }
}
