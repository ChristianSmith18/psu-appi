import {
  IsInt,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsInt({ message: 'El campo "id" debe ser int.' })
  @IsNotEmpty({ message: 'El campo "id" no debe estar vacío.' })
  @IsOptional()
  id?: number;

  @MinLength(3, {
    message: 'El campo "firstname" debe contener al menos 3 caracteres.',
  })
  @IsString({ message: 'El campo "firstname" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "firstname" no debe estar vacío.' })
  firstname!: string;

  @MinLength(3, {
    message: 'El campo "lastname" debe contener al menos 3 caracteres.',
  })
  @IsString({ message: 'El campo "lastname" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "lastname" no debe estar vacío.' })
  lastname!: string;

  @IsEmail({}, { message: 'El campo "email" debe ser un correo válido.' })
  @IsNotEmpty({ message: 'El campo "email" no debe estar vacío.' })
  email!: string;

  @MinLength(8, {
    message: 'El campo "password" debe contener al menos 8 caracteres.',
  })
  @IsString({ message: 'El campo "password" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "password" no debe estar vacío.' })
  password!: string;
}
