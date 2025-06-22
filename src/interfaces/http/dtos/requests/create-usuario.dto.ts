import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'João da Silva' })
  nomeUsuario: string;

  @ApiProperty({ example: '04852227012' })
  cpfUsuario: string;

  @ApiProperty({ example: 'joao@email.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  senha: string;

  @ApiProperty({ required: false, example: '(11) 99999-9999' })
  telefone?: string;

  @ApiProperty({
    required: false,
    example: {
      rua: 'Rua A',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      pais: 'Brasil',
    },
  })
  endereco?: {
    rua?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    pais?: string;
  };

  @ApiProperty({
    required: false,
    example: { type: 'Point', coordinates: [-46.625290, -23.533773] },
  })
  localizacao?: {
    type: 'Point';
    coordinates: [number, number];
  };

  @ApiProperty({ example: 'aluno', enum: ['aluno', 'administrador'] })
  tipo: 'aluno' | 'administrador';
}
