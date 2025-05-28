import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inscricao } from './inscricao.model';
import { Aula } from './aula.model';

@Entity('progresso_aula')
export class ProgressoAula {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inscricao, (inscricao) => inscricao.progressoAulas, { onDelete: 'CASCADE' })
  inscricao: Inscricao;

  @ManyToOne(() => Aula, (aula) => aula.progressos, { onDelete: 'CASCADE' })
  aula: Aula;

  @Column({ default: false })
  concluida: boolean;

  @Column({ type: 'timestamp', nullable: true })
  dataConclusao: Date;
}
