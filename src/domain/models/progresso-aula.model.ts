import { InscricaoModel } from './inscricao.model';
import { AulaModel } from './aula.model';

export interface ProgressoAulaModel {
  id?: number;
  inscricao: InscricaoModel;
  aula: AulaModel;
  concluida: boolean;
  dataConclusao?: Date;
}