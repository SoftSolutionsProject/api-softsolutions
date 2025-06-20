import { ApiProperty } from '@nestjs/swagger';
import { AulaModel } from 'src/domain/models/aula.model';

export class AulaResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nomeAula: string;

  @ApiProperty()
  tempoAula: number;

  @ApiProperty()
  videoUrl: string;

  @ApiProperty({ required: false, type: [String] })
  materialApoio?: string[];

  @ApiProperty()
  descricaoConteudo: string;

  @ApiProperty()
  modulo: {
    id: number;
    nomeModulo: string;
  };

  constructor(aula: AulaModel) {
    this.id = aula.id!;
    this.nomeAula = aula.nomeAula;
    this.tempoAula = aula.tempoAula;
    this.videoUrl = aula.videoUrl;
    this.materialApoio = aula.materialApoio;
    this.descricaoConteudo = aula.descricaoConteudo;
    this.modulo = {
      id: aula.modulo.id!,
      nomeModulo: aula.modulo.nomeModulo,
    };
  }
}
