import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CursoEntity } from './curso.entity';
import { AulaEntity } from './aula.entity';
import { ModuloModel } from 'src/domain/models/modulo.model';

@Entity('modulos')
export class ModuloEntity implements ModuloModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeModulo: string;

  @Column()
  tempoModulo: number;

  @ManyToOne(() => CursoEntity, curso => curso.modulos, { onDelete: 'CASCADE' })
  curso: CursoEntity;

  @OneToMany(() => AulaEntity, aula => aula.modulo)
  aulas: AulaEntity[];
}