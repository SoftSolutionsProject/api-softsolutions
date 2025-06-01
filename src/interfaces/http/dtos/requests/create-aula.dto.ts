export class CreateAulaDto {
  nomeAula: string;
  tempoAula: number;
  videoUrl: string;
  materialApoio?: string[];
  descricaoConteudo: string;
  idModulo: number;
}