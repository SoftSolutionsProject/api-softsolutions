import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Modulo } from '../modulo/modulo.entity';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeCurso: string;

  @Column()
  tempoCurso: number; // Em horas

  @Column()
  descricaoCurta: string;

  @Column()
  descricaoDetalhada: string;

  @Column()
  professor: string;

  @Column()
  categoria: string;

  @Column({ default: 'ativo' })
  status: 'ativo' | 'inativo';

  @Column({ type: 'float', default: 0 })
  avaliacao: number;

  @Column()
  imagemCurso: string;

  @OneToMany(() => Modulo, modulo => modulo.curso)
  modulos: Modulo[];
}
