import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateTestDto {
  // @ApiProperty({ example: 1 })
  // @IsInt({ message: 'El campo "userId" debe ser int.' })
  // @IsNotEmpty({ message: 'El campo "userId" no debe estar vacío.' })
  // userId: number;

  @ApiProperty({ example: 20 })
  @Max(100, {
    message:
      'El campo "numberOfQuestions" puede tener como máximo el valor 100.',
  })
  @Min(1, {
    message: 'El campo "numberOfQuestions" puede tener como mínimo el valor 1.',
  })
  @IsInt({ message: 'El campo "numberOfQuestions" debe ser int.' })
  @IsNotEmpty({ message: 'El campo "numberOfQuestions" no debe estar vacío.' })
  numberOfQuestions = 20;
}
