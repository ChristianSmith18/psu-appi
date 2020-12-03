import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerService } from './answer.service';
import { AnswerEntity } from './entity/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerEntity])],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
