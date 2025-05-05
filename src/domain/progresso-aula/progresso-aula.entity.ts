import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Inscricao } from '../inscricao/inscricao.entity';
import { Aula } from '../aula/aula.entity';

@Entity('progresso_aula')
export class ProgressoAula {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inscricao, inscricao => inscricao.progressoAulas)
  inscricao: Inscricao;

  @ManyToOne(() => Aula, aula => aula.progressos)
  aula: Aula;

  @Column({ default: false })
  concluida: boolean;

  @Column({ type: 'timestamp', nullable: true })
  dataConclusao: Date;
}