import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateScoreDto {
  @ApiProperty({ example: 10 })
  @Min(0, { message: 'El campo "correctAnswers" debe ser mayor o igual a 0.' })
  @IsInt({ message: 'El campo "correctAnswers" debe ser un entero.' })
  @IsNotEmpty({ message: 'El campo "correctAnswers" no debe estar vacío.' })
  correctAnswers: number;

  @ApiProperty({ example: 20 })
  @Min(1, { message: 'El campo "total" debe ser a 0.' })
  @IsInt({ message: 'El campo "total" debe ser un entero.' })
  @IsNotEmpty({ message: 'El campo "total" no debe estar vacío.' })
  @IsOptional()
  total: number;
}
