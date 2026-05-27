export interface SearchItem {
  id: string;
  tipo: 'curso' | 'aula';
  cursoId: number | null;
  aulaId: number | null;
  titulo: string;
  descricao: string;
  descricaoDetalhada?: string;
  categoria: string;
  tags?: string[];
  conteudo: string;
  professor: string;
  status: string;
  avaliacao: number | null;
  imagemCurso: string | null;
  tempoCurso: number | null;
  modulo: string;
  curso: string;
  videoUrl: string | null;
  tempoAula: number | null;
  url?: string;
  semanticScore?: number;
}
