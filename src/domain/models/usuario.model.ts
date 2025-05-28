import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Inscricao } from './inscricao.model';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeUsuario: string;

  @Column({ unique: true })
  cpfUsuario: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column({ nullable: true })
  telefone?: string;

  @Column({ type: 'json', nullable: true })
  endereco?: {
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    pais?: string;
  };

  @Column({ type: 'json', nullable: true })
  localizacao?: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Column({ default: 'aluno' })
  tipo: 'aluno' | 'administrador';

  @OneToMany(() => Inscricao, (inscricao) => inscricao.usuario)
  inscricoes: Inscricao[];
}
