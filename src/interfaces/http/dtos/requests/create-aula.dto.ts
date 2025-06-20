import { ApiProperty } from '@nestjs/swagger';

export class CreateAulaDto {
  @ApiProperty({ example: 'Introdução ao NestJS' })
  nomeAula: string;

  @ApiProperty({ example: 60 })
  tempoAula: number;

  @ApiProperty({ example: 'https://meuservidor.com/videos/introducao.mp4' })
  videoUrl: string;

  @ApiProperty({
    required: false,
    example: ['slide.pdf', 'material_extra.pdf'],
  })
  materialApoio?: string[];

  @ApiProperty({ example: 'Descrição detalhada do conteúdo da aula.' })
  descricaoConteudo: string;

  @ApiProperty({ example: 1 })
  idModulo: number;
}
