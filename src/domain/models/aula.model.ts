import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Modulo } from './modulo.model';
import { ProgressoAula } from './progresso-aula.model';

@Entity('aulas')
export class Aula {
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

  @ManyToOne(() => Modulo, (modulo) => modulo.aulas, { onDelete: 'CASCADE' })
  modulo: Modulo;

  @OneToMany(() => ProgressoAula, (progresso) => progresso.aula)
  progressos: ProgressoAula[];
}
