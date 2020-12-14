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

  @Column({ type: 'varchar', length: 18 })
  ip: string;

  @Column({ type: 'varchar', name: 'continente', length: 25, nullable: true })
  continent: string;

  @Column({ type: 'varchar', name: 'pais', length: 25, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  region: string;

  @Column({ type: 'varchar', name: 'ciudad', length: 35, nullable: true })
  city: string;

  @Column({ type: 'decimal', name: 'latitud', nullable: true })
  latitude: number;

  @Column({ type: 'decimal', name: 'longitud', nullable: true })
  longitude: number;

  @Column({ type: 'varchar', name: 'lenguaje', length: 18, nullable: true })
  language: string;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_de_conexion' })
  connectedAt: Date;

  @ManyToOne(
    () => UserEntity,
    user => user.records,
  )
  user: UserEntity;
}
