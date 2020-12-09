import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { EnumToString } from '@common/helpers/enumToString.helper';
import { Difficulty } from '../enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ example: 1 })
  @IsInt({ message: 'El campo "id" debe ser int.' })
  @IsNotEmpty({ message: 'El campo "id" no debe estar vacío.' })
  @IsOptional()
  id?: number;

  @ApiProperty({
    example: ['Este es el enunciado', '<img>', 'Con su segunda parte'],
    isArray: true,
  })
  @MinLength(3, {
    message: 'El campo "statement" debe contener al menos 3 caracteres.',
    each: true,
  })
  @IsString({ message: 'El campo "statement" debe ser string.', each: true })
  @IsArray({ message: 'El campo "statement" debe ser un arreglo de strings.' })
  @IsNotEmpty({ message: 'El campo "statement" no debe estar vacío.' })
  statement!: string[];

  @ApiProperty({ example: 'Esta es la opción 1' })
  @MinLength(3, {
    message: 'El campo "option1" debe contener al menos 3 caracteres.',
  })
  @IsString({ message: 'El campo "option1" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "option1" no debe estar vacío.' })
  option1!: string;

  @ApiProperty({ example: 'Esta es la opción 2' })
  @MinLength(3, {
    message: 'El campo "option2" debe contener al menos 3 caracteres.',
  })
  @IsString({ message: 'El campo "option2" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "option2" no debe estar vacío.' })
  option2!: string;

  @ApiProperty({ example: 'Esta es la opción 3' })
  @MinLength(3, {
    message: 'El campo "option3" debe contener al menos 3 caracteres.',
  })
  @IsString({ message: 'El campo "option3" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "option3" no debe estar vacío.' })
  option3!: string;

  @ApiProperty({ example: 'Esta es la opción 4' })
  @MinLength(3, {
    message: 'El campo "option4" debe contener al menos 3 caracteres.',
  })
  @IsString({ message: 'El campo "option4" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "option4" no debe estar vacío.' })
  option4!: string;

  @ApiProperty({ example: 'Esta es la opción 5' })
  @MinLength(3, {
    message: 'El campo "option5" debe contener al menos 3 caracteres.',
  })
  @IsString({ message: 'El campo "option5" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "option5" no debe estar vacío.' })
  option5!: string;

  @ApiProperty({ enum: Difficulty, example: 'MEDIUM' })
  @IsEnum(Difficulty, {
    message: `El campo "difficulty" debe ser de tipo: [${EnumToString(
      Difficulty,
    )}].`,
  })
  @IsOptional()
  difficulty?: Difficulty;
}
