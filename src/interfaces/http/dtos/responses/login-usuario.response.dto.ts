import { ApiProperty } from '@nestjs/swagger';

export class LoginUsuarioResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  usuario: {
    id: number;
    nome: string;
    email: string;
    tipo: string;
  };

  constructor(token: string, usuario: { id: number; nome: string; email: string; tipo: string }) {
    this.access_token = token;
    this.usuario = usuario;
  }
}
