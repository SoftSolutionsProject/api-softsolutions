import { ApiProperty } from '@nestjs/swagger';
import { UsuarioModel } from 'src/domain/models/usuario.model';

export class UsuarioResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nomeUsuario: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  tipo: string;

  @ApiProperty()
  cpfUsuario: string;

  @ApiProperty({ required: false })
  telefone?: string;

  @ApiProperty({ required: false, type: Object })
  endereco?: any;

  @ApiProperty({ required: false, type: Object })
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
