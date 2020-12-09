import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
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

  @ApiProperty({ example: 1, enum: [1, 2, 3, 4, 5] })
  @Max(5, { message: 'El campo "correctOption" debe ser 1, 2, 3, 4 o 5.' })
  @Min(1, { message: 'El campo "correctOption" debe ser 1, 2, 3, 4 o 5.' })
  @IsInt({ message: 'El campo "correctOption" debe ser int.' })
  @IsNotEmpty({ message: 'El campo "correctOption" no debe estar vacío.' })
  correctOption: 1 | 2 | 3 | 4 | 5;

  @ApiProperty({
    example: [
      'Esta es una descripción detallada',
      '<img>',
      'Con su segunda parte',
    ],
    isArray: true,
  })
  @MinLength(3, {
    message:
      'El campo "description" debe contener al menos 3 caracteres cada string.',
    each: true,
  })
  @IsString({
    message: 'El campo "description" debe ser un arreglo de strings.',
    each: true,
  })
  @IsArray({ message: 'El campo "description" debe ser un arreglo.' })
  @IsNotEmpty({ message: 'El campo "description" no debe estar vacío.' })
  description: string[];
}
