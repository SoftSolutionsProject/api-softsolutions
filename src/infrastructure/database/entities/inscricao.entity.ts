import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { CursoEntity } from './curso.entity';
import { ProgressoAulaEntity } from './progresso-aula.entity';
import { InscricaoModel } from 'src/domain/models/inscricao.model';

@Entity('inscricoes')
export class InscricaoEntity implements InscricaoModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.inscricoes)
  usuario: UsuarioEntity;

  @ManyToOne(() => CursoEntity, curso => curso.inscricoes)
  curso: CursoEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataInscricao: Date;

  @Column({ default: 'ativo' })
  status: 'ativo' | 'concluido' | 'cancelado';

  @OneToMany(() => ProgressoAulaEntity, progresso => progresso.inscricao)
  progressoAulas: ProgressoAulaEntity[];
}