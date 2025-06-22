import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateModuloDto {
  @ApiPropertyOptional({ example: 'Módulo 1: Fundamentos' })
  nomeModulo?: string;

  @ApiPropertyOptional({ example: 150 })
  tempoModulo?: number;
}
