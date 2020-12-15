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
  correctOption: 1 | 2 | 3 | 4 | 5;

  @Column('text', { array: true, name: 'descripcion', nullable: false })
  description: string[];

  @OneToOne(
    () => QuestionEntity,
    question => question.answer,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'pregunta_id' })
  question: QuestionEntity;
}
