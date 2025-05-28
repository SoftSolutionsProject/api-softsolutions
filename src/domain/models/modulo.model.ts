import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Curso } from './curso.model';
import { Aula } from './aula.model';

@Entity('modulos')
export class Modulo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeModulo: string;

  @Column()
  tempoModulo: number;

  @ManyToOne(() => Curso, (curso) => curso.modulos, { onDelete: 'CASCADE' })
  curso: Curso;

  @OneToMany(() => Aula, (aula) => aula.modulo)
  aulas: Aula[];
}
