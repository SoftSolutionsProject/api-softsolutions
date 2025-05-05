// src/domain/inscricao/inscricao.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Curso } from '../curso/curso.entity';
import { ProgressoAula } from './progresso-aula.entity';

@Entity('inscricoes')
export class Inscricao {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, usuario => usuario.inscricoes)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @ManyToOne(() => Curso, curso => curso.inscricoes)
  @JoinColumn({ name: 'cursoId' })
  curso: Curso;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataInscricao: Date;

  @Column({ default: 'ativo' })
  status: 'ativo' | 'concluido' | 'cancelado';

  @OneToMany(() => ProgressoAula, progresso => progresso.inscricao)
  progressoAulas: ProgressoAula[];
}