import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsInt({ message: 'El campo "id" debe ser int.' })
  @IsNotEmpty({ message: 'El campo "id" no debe estar vacío.' })
  id?: number;

  @MinLength(3, {
    message: 'El campo "statement" debe contener al menos 3 caracteres.',
  })
  @IsString({ message: 'El campo "statement" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "statement" no debe estar vacío.' })
  statement!: string[];

  @MinLength(3, {
    message: 'El campo "option1" debe contener al menos 3 caracteres.',
  })
  @IsString({ message: 'El campo "option1" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "option1" no debe estar vacío.' })
  option1!: string;

  @MinLength(3, {
    message: 'El campo "option2" debe contener al menos 3 caracteres.',
  })
  @IsString({ message: 'El campo "option2" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "option2" no debe estar vacío.' })
  option2!: string;

  @MinLength(3, {
    message: 'El campo "option3" debe contener al menos 3 caracteres.',
  })
  @IsString({ message: 'El campo "option3" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "option3" no debe estar vacío.' })
  option3!: string;

  @MinLength(3, {
    message: 'El campo "option4" debe contener al menos 3 caracteres.',
  })
  @IsString({ message: 'El campo "option4" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "option4" no debe estar vacío.' })
  option4!: string;
}
