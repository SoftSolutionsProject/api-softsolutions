import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUsuarioDto {
  @ApiPropertyOptional({ example: 'João da Silva' })
  nomeUsuario?: string;

  @ApiPropertyOptional({ example: 'joao.novo@email.com' })
  email?: string;

  @ApiPropertyOptional({ example: '(11) 98888-7777' })
  telefone?: string;

  @ApiPropertyOptional({
    example: {
      rua: 'Rua B',
      numero: '456',
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

  @ApiPropertyOptional({
    example: { type: 'Point', coordinates: [-46.625290, -23.533773] },
  })
  localizacao?: {
    type: 'Point';
    coordinates: [number, number];
  };
}
