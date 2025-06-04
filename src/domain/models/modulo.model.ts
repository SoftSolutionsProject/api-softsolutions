import { AulaModel } from './aula.model';
export interface ModuloModel {
  id?: number;
  nomeModulo: string;
  tempoModulo: number;
  curso: any; // tipar melhor depois se necessário
  aulas?: AulaModel[];
}