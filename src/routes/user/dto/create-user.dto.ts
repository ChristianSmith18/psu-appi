import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 1 })
  @IsInt({ message: 'El campo "id" debe ser int.' })
  @IsNotEmpty({ message: 'El campo "id" no debe estar vacío.' })
  @IsOptional()
  id?: number;

  @ApiProperty({ example: 'Juan' })
  @MinLength(3, {
    message: 'El campo "firstname" debe contener al menos 3 caracteres.',
  })
  @IsString({ message: 'El campo "firstname" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "firstname" no debe estar vacío.' })
  firstname!: string;

  @ApiProperty({ example: 'Perez' })
  @MinLength(3, {
    message: 'El campo "lastname" debe contener al menos 3 caracteres.',
  })
  @IsString({ message: 'El campo "lastname" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "lastname" no debe estar vacío.' })
  lastname!: string;

  @ApiProperty({ example: 'ejemplo@ejemplo.com' })
  @IsEmail({}, { message: 'El campo "email" debe ser un correo válido.' })
  @IsNotEmpty({ message: 'El campo "email" no debe estar vacío.' })
  email!: string;

  @ApiProperty({ example: '12345678' })
  @MinLength(8, {
    message: 'El campo "password" debe contener al menos 8 caracteres.',
  })
  @IsString({ message: 'El campo "password" debe ser string.' })
  @IsNotEmpty({ message: 'El campo "password" no debe estar vacío.' })
  password!: string;

  @ApiProperty({ enum: ['USER_ROLE', 'ADMIN_ROLE'], default: 'USER_ROLE' })
  @IsEnum(['USER_ROLE', 'ADMIN_ROLE'], {
    message: `El campo "role" debe ser de tipo: ['USER_ROLE', 'ADMIN_ROLE'].`,
  })
  @IsString({ message: 'El campo "role" debe ser un string.' })
  @IsNotEmpty({ message: 'El campo "role" no debe estar vacío.' })
  @IsOptional()
  role!: string;
}
