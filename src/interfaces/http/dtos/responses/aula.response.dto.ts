import { AulaModel } from 'src/domain/models/aula.model';

export class AulaResponseDto {
  id: number;
  nomeAula: string;
  tempoAula: number;
  videoUrl: string;
  materialApoio?: string[];
  descricaoConteudo: string;
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