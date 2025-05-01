import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Curso } from '../../domain/curso/curso.entity';

@Entity('modulos')
export class Modulo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeModulo: string;

  @Column()
  tempoModulo: number;

  @ManyToOne(() => Curso, curso => curso.modulos, { onDelete: 'CASCADE' })
  curso: Curso;
}