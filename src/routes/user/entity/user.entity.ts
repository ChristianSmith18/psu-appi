import { QuestionEntity } from '@src/routes/question/entity';
import { hash } from 'bcryptjs';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecordEntity } from '.';

@Entity('Usuario')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20, name: 'nombre' })
  firstname!: string;

  @Column({ type: 'varchar', length: 20, name: 'apellido' })
  lastname!: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    unique: true,
    name: 'correo',
  })
  email!: string;

  @Column({ type: 'varchar', name: 'clave', select: false })
  password!: string;

  @Column({ type: 'varchar', name: 'tipo', default: 'USER_ROLE', length: 15 })
  role!: string;

  @Column('integer', {
    array: true,
    name: 'preguntas',
    nullable: true,
    select: false,
    default: () => 'array[]::integer[]',
  })
  questions: number[];

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_de_creacion' })
  createdAt: Date;

  @OneToMany(
    () => RecordEntity,
    record => record.user,
  )
  records: RecordEntity[];

  @OneToMany(
    () => QuestionEntity,
    question => question.user,
    { nullable: true },
  )
  createdQuestions: QuestionEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) {
      return;
    }
    this.password = await hash(this.password, 10);
  }

  @BeforeInsert()
  @BeforeUpdate()
  applyFormat() {
    this.firstname = this.capitalize(this.firstname);
    this.lastname = this.capitalize(this.lastname);
    this.email = this.email.toLowerCase();
  }

  private capitalize(text: string) {
    text = text.split(' ')[0];
    return (
      text.substring(0, 1).toUpperCase() +
      text.substring(1, text.length).toLowerCase()
    );
  }
}
