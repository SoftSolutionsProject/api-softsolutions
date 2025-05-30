import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CursoModel } from 'src/domain/models/curso.model';
import { OneToMany } from 'typeorm';
import { ModuloEntity } from './modulo.entity';

@Entity('cursos')
export class CursoEntity implements CursoModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeCurso: string;

  @Column()
  tempoCurso: number;

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

  @OneToMany(() => ModuloEntity, modulo => modulo.curso)
  modulos: ModuloEntity[];
}