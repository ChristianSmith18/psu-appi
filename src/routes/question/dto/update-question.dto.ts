import { PartialType } from '@nestjs/mapped-types';

import { CreateQuestionDto } from '.';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
