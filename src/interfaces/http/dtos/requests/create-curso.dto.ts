import { ApiProperty } from '@nestjs/swagger';

export class CreateCursoDto {
  @ApiProperty({ example: 'Curso de NestJS' })
  nomeCurso: string;

  @ApiProperty({ example: 40 })
  tempoCurso: number;

  @ApiProperty({ example: 'Curso rápido de NestJS.' })
  descricaoCurta: string;

  @ApiProperty({ example: 'Curso completo de NestJS com práticas reais.' })
  descricaoDetalhada: string;

  @ApiProperty({ example: 'Prof. João Silva' })
  professor: string;

  @ApiProperty({ example: 'Programação' })
  categoria: string;

  @ApiProperty({ required: false, example: 'ativo', enum: ['ativo', 'inativo'] })
  status?: 'ativo' | 'inativo';

  @ApiProperty({ required: false, example: 5 })
  avaliacao?: number;

  @ApiProperty({ example: 'https://meuservidor.com/imagens/curso-nestjs.png' })
  imagemCurso: string;
}
