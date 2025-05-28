export interface CursoModel {
  id?: number;
  nomeCurso: string;
  tempoCurso: number;
  descricaoCurta: string;
  descricaoDetalhada: string;
  professor: string;
  categoria: string;
  status: 'ativo' | 'inativo';
  avaliacao: number;
  imagemCurso: string;
}