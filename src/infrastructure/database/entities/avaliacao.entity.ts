import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { CursoEntity } from './curso.entity';

@Entity('avaliacoes')
export class AvaliacaoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  nota: number;

  @Column({ type: 'text', nullable: true })
  comentario: string;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  @ManyToOne(() => UsuarioEntity)
  @JoinColumn({ name: 'usuarioId' })
  usuario: UsuarioEntity;

  @ManyToOne(() => CursoEntity)
  @JoinColumn({ name: 'cursoId' })
  curso: CursoEntity;
}
