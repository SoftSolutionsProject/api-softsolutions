import { UsuarioModel } from 'src/domain/models/usuario.model';
export class UsuarioResponseDto {
  id: number;
  nomeUsuario: string;
  email: string;
  tipo: string;
  cpfUsuario: string;
  telefone?: string;
  endereco?: any;
  localizacao?: any;

  constructor(usuario: Partial<UsuarioModel>) {
    this.id = usuario.id!;
    this.nomeUsuario = usuario.nomeUsuario!;
    this.email = usuario.email!;
    this.tipo = usuario.tipo!;
    this.cpfUsuario = usuario.cpfUsuario!;
    this.telefone = usuario.telefone;
    this.endereco = usuario.endereco;
    this.localizacao = usuario.localizacao;
  }
}
