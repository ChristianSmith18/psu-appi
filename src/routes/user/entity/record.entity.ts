import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '.';

@Entity('Registro_de_Conexion')
export class RecordEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  ip: string;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_de_conexion' })
  connectedAt: Date;

  @ManyToOne(
    () => UserEntity,
    user => user.records,
  )
  user: UserEntity;
}
