export class DashboardResponseDto {
  totalCursosInscritos: number;

  totalCertificados: number;

  progressoPorCurso: {
    cursoId: number;
    nomeCurso: string;
    percentualConcluido: number;
  }[];

  historicoEstudo: {
    data: string;
    minutosEstudados: number;
  }[];

  cursosPorCategoria: {
    categoria: string;
    total: number;
  }[];

  notasMediasPorCurso: {
    cursoId: number;
    nomeCurso: string;
    notaMedia: number;
  }[];

  tempoTotalEstudoMinutos: number;

  avaliacoes: {
    cursoId: number;
    nomeCurso: string;
    avaliacaoFeita: boolean;
  }[];

  diasAtivosEstudo: number;
  ultimoDiaAtividade: string | null;
  diasConsecutivosEstudo: number;
  sequenciaAtualDiasConsecutivos: number;
}
