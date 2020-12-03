import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerModule } from '../answer/answer.module';
import { QuestionEntity } from './entity';

import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionEntity]), AnswerModule],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
