import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AnswerEntity } from '@routes/answer/entity/answer.entity';
import { Difficulty } from '../enum';

@Entity('Pregunta')
export class QuestionEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column('text', { array: true, name: 'enunciado', nullable: false })
  statement: string[];

  @Column({ type: 'varchar', name: 'opcion_1', nullable: false })
  option1: string;

  @Column({ type: 'varchar', name: 'opcion_2', nullable: false })
  option2: string;

  @Column({ type: 'varchar', name: 'opcion_3', nullable: false })
  option3: string;

  @Column({ type: 'varchar', name: 'opcion_4', nullable: false })
  option4: string;

  @Column({
    type: 'varchar',
    length: 10,
    enum: Difficulty,
    default: Difficulty.MEDIUM,
    name: 'dificultad',
    nullable: false,
  })
  difficulty: Difficulty;

  @OneToOne(
    () => AnswerEntity,
    answer => answer.question,
  )
  answer: AnswerEntity;
}
