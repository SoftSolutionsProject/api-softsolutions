import { UsuarioModel } from 'src/domain/models/usuario.model';

export class UsuarioResponseDto {
  id: number;
  nome: string;
  email: string;
  tipo: string;

 constructor(usuario: Partial<UsuarioModel>) {
  this.id = usuario.id!;
  this.nome = usuario.nomeUsuario!;
  this.email = usuario.email!;
  this.tipo = usuario.tipo!;
}

}
