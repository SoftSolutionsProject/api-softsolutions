import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioModel } from 'src/domain/models/usuario.model';

@Entity('usuarios')
export class UsuarioEntity implements UsuarioModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeUsuario: string;

  @Column()
  cpfUsuario: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column({ nullable: true })
  telefone?: string;

  @Column({ type: 'simple-json', nullable: true })
  endereco?: any;

  @Column({ type: 'simple-json', nullable: true })
  localizacao?: any;

  @Column()
  tipo: 'aluno' | 'administrador';
}
