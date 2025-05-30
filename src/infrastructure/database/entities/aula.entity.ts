import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ModuloEntity } from './modulo.entity';
import { AulaModel } from 'src/domain/models/aula.model';

@Entity('aulas')
export class AulaEntity implements AulaModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeAula: string;

  @Column()
  tempoAula: number;

  @Column()
  videoUrl: string;

  @Column('simple-array', { nullable: true })
  materialApoio: string[];

  @Column()
  descricaoConteudo: string;

  @ManyToOne(() => ModuloEntity, modulo => modulo.aulas, { onDelete: 'CASCADE' })
  modulo: ModuloEntity;
}