import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AnswerEntity } from '@routes/answer/entity/answer.entity';
import { Difficulty } from '../enum';
import { UserEntity } from '@src/routes/user/entity';

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

  @Column({ type: 'varchar', name: 'opcion_5', nullable: false })
  option5: string;

  @Column({
    type: 'varchar',
    length: 10,
    enum: Difficulty,
    default: Difficulty.MEDIUM,
    name: 'dificultad',
    nullable: false,
  })
  difficulty: Difficulty;

  @Column({
    type: 'int',
    enum: [0, 1, 2, 3, 4],
    name: 'dificultad_numero',
    default: 2,
    select: false,
    nullable: false,
  })
  difficultyNumber: 0 | 1 | 2 | 3 | 4;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'ultima_actualizacion',
  })
  updateAt: Date;

  @OneToOne(
    () => AnswerEntity,
    answer => answer.question,
  )
  answer: AnswerEntity;

  @ManyToOne(
    () => UserEntity,
    user => user.createdQuestions,
    { nullable: true },
  )
  user: UserEntity;

  @BeforeInsert()
  generateDifficultyNumber() {
    switch (this.difficulty) {
      case 'VERY EASY':
        this.difficultyNumber = 0;
        break;
      case 'EASY':
        this.difficultyNumber = 1;
        break;
      case 'MEDIUM':
        this.difficultyNumber = 2;
        break;
      case 'HARD':
        this.difficultyNumber = 3;
        break;
      case 'VERY HARD':
        this.difficultyNumber = 4;
        break;
      default:
        this.difficultyNumber = 2;
        break;
    }
  }

  @BeforeUpdate()
  updateDate() {
    this.updateAt = new Date();
  }
}
