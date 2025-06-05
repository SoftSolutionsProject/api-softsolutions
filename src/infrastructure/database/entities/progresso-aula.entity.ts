import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { InscricaoEntity } from './inscricao.entity';
import { AulaEntity } from './aula.entity';
import { ProgressoAulaModel } from 'src/domain/models/progresso-aula.model';

@Entity('progresso_aula')
export class ProgressoAulaEntity implements ProgressoAulaModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => InscricaoEntity, inscricao => inscricao.progressoAulas)
  inscricao: InscricaoEntity;

  @ManyToOne(() => AulaEntity, aula => aula.progressos)
  aula: AulaEntity;

  @Column({ default: false })
  concluida: boolean;

  @Column({ type: 'timestamp', nullable: true })
  dataConclusao: Date;
}