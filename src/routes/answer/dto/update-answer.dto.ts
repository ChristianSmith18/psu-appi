import { PartialType } from '@nestjs/mapped-types';
import { CreateAnswerDto } from '.';

export class UpdateAnswerDto extends PartialType(CreateAnswerDto) {}
