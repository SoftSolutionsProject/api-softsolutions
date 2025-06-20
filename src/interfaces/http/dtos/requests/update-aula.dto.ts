import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAulaDto {
  @ApiPropertyOptional({ example: 'Aula Atualizada de NestJS' })
  nomeAula?: string;

  @ApiPropertyOptional({ example: 90 })
  tempoAula?: number;

  @ApiPropertyOptional({ example: 'https://meuservidor.com/videos/atualizado.mp4' })
  videoUrl?: string;

  @ApiPropertyOptional({
    example: ['novo_slide.pdf'],
  })
  materialApoio?: string[];

  @ApiPropertyOptional({ example: 'Nova descrição do conteúdo da aula.' })
  descricaoConteudo?: string;
}
