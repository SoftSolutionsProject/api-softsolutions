import { ApiProperty } from '@nestjs/swagger';

export class CreateModuloDto {
  @ApiProperty({ example: 'Módulo 1: Introdução' })
  nomeModulo: string;

  @ApiProperty({ example: 120 })
  tempoModulo: number;

  @ApiProperty({ example: 1 })
  idCurso: number;
}
