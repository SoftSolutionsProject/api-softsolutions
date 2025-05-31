import { Column, Entity, PrimaryGeneratedColumn, OneToMany  } from 'typeorm';
import { CursoModel } from 'src/domain/models/curso.model';
import { ModuloEntity } from './modulo.entity';
import { InscricaoEntity } from './inscricao.entity';

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

  @OneToMany(() => InscricaoEntity, inscricao => inscricao.curso)
  inscricoes: InscricaoEntity[];
}
