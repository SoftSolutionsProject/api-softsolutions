import { UsuarioModel } from './usuario.model';
import { CursoModel } from './curso.model';
import { ProgressoAulaModel } from './progresso-aula.model';

export interface InscricaoModel {
  id?: number;
  usuario: UsuarioModel;
  curso: CursoModel;
  dataInscricao: Date;
  status: 'ativo' | 'concluido' | 'cancelado';
  progressoAulas?: ProgressoAulaModel[];
}