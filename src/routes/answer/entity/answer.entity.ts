import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { QuestionEntity } from '@routes/question/entity';

@Entity('Respuesta')
export class AnswerEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({ type: 'int', name: 'alternativa_correcta' })
  correctOption: 1 | 2 | 3 | 4;

  @Column({ type: 'varchar', name: 'descripcion' })
  description: string;

  @OneToOne(
    () => QuestionEntity,
    question => question.answer,
  )
  @JoinColumn({ name: 'pregunta_id' })
  question: QuestionEntity;
}
