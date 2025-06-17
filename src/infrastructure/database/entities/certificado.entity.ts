import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { CursoEntity } from './curso.entity';

@Entity('certificados')
export class CertificadoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numeroSerie: string;

  @ManyToOne(() => UsuarioEntity)
  @JoinColumn({ name: 'usuarioId' })
  usuario: UsuarioEntity;

  @ManyToOne(() => CursoEntity)
  @JoinColumn({ name: 'cursoId' })
  curso: CursoEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataEmissao: Date;

  @Column({ nullable: true })
  urlPdf?: string;
}
