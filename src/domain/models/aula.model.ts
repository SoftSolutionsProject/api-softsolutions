import { ModuloModel } from './modulo.model';

export interface AulaModel {
  id?: number;
  nomeAula: string;
  tempoAula: number;
  videoUrl: string;
  materialApoio?: string[];
  descricaoConteudo: string;
  modulo: ModuloModel;
}