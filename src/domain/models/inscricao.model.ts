import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from './usuario.model';
import { Curso } from './curso.model';
import { ProgressoAula } from './progresso-aula.model';

@Entity('inscricoes')
export class Inscricao {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.inscricoes)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @ManyToOne(() => Curso, (curso) => curso.inscricoes)
  @JoinColumn({ name: 'cursoId' })
  curso: Curso;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataInscricao: Date;

  @Column({ default: 'ativo' })
  status: 'ativo' | 'concluido' | 'cancelado';

  @OneToMany(() => ProgressoAula, (progresso) => progresso.inscricao)
  progressoAulas: ProgressoAula[];
}
