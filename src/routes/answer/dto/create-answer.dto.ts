import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'El campo "id" no debe estar vacío.' })
  @IsOptional()
  id?: number;

  @ApiProperty({ example: 1, enum: [1, 2, 3, 4] })
  @Max(4, { message: 'El campo "correctOption" debe ser 1, 2, 3 o 4.' })
  @Min(1, { message: 'El campo "correctOption" debe ser 1, 2, 3 o 4.' })
  @IsInt({ message: 'El campo "correctOption" debe ser int.' })
  @IsNotEmpty({ message: 'El campo "correctOption" no debe estar vacío.' })
  correctOption: 1 | 2 | 3 | 4;

  @ApiProperty({ example: 'Esta es una descripción detallada de la respuesta' })
  @MinLength(5, {
    message: 'El campo "description" debe contener al menos 5 caracteres.',
  })
  @IsString({ message: 'El campo "description" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "description" no debe estar vacío.' })
  description: string;
}
