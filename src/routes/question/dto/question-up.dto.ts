import { PartialType } from '@nestjs/swagger';
import { QuestionDto } from './question.dto';

export class QuestionUpDto extends PartialType(QuestionDto) {}
