import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateAnswerDto } from '@src/routes/answer/dto';
import { CreateQuestionDto } from '.';
import { Type } from 'class-transformer';

export class QuestionDto {
  @ValidateNested({
    message: 'El campo "question" debe ser de tipo createQuestionDto.',
  })
  @Type(() => CreateQuestionDto)
  @IsNotEmpty({ message: 'El campo "question" no debe estar vacío.' })
  question: CreateQuestionDto;

  @ValidateNested({
    message: 'El campo "answer" debe ser de tipo createAnswerDto.',
  })
  @Type(() => CreateAnswerDto)
  @IsNotEmpty({ message: 'El campo "answer" no debe estar vacío.' })
  answer: CreateAnswerDto;
}
