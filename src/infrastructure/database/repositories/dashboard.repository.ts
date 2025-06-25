import { Injectable } from '@nestjs/common';
import { DashboardResponseDto } from 'src/interfaces/http/dtos/responses/dashboard-response.dto';
import { InscricaoRepository } from './inscricao.repository';
import { CertificadoRepository } from './certificado.repository';
import { ProgressoAulaRepository } from './progresso-aula.repository';
import { CursoRepository } from './curso.repository';
import { AvaliacaoRepository } from './avaliacao.repository';

@Injectable()
export class DashboardRepository {
  constructor(
    private readonly inscricaoRepo: InscricaoRepository,
    private readonly certificadoRepo: CertificadoRepository,
    private readonly progressoRepo: ProgressoAulaRepository,
    private readonly cursoRepo: CursoRepository,
    private readonly avaliacaoRepo: AvaliacaoRepository,
  ) {}

  async getDashboardData(usuarioId: number): Promise<DashboardResponseDto> {
    const inscricoes = await this.inscricaoRepo.findByUsuario(usuarioId);
    const inscricoesAtivas = inscricoes.filter(i => i.status === 'ativo');
    const certificados = await this.certificadoRepo.findAllByUsuario(usuarioId);

    const progressoPorCurso = inscricoesAtivas.map((inscricao) => {
      const cursoId = inscricao.curso?.id ?? 0;
      const nomeCurso = inscricao.curso?.nomeCurso ?? '';
      const totalAulas = inscricao.progressoAulas?.length ?? 0;
      const concluidas = inscricao.progressoAulas?.filter((p) => p.concluida).length ?? 0;
      const percentualConcluido = totalAulas > 0 ? Math.round((concluidas / totalAulas) * 100) : 0;

      return { cursoId, nomeCurso, percentualConcluido };
    });

    const historicoEstudo = this.getHistoricoEstudo(inscricoes);
    const diasAtivosEstudo = historicoEstudo.length;
    const ultimoDiaAtividade = diasAtivosEstudo > 0
      ? historicoEstudo[historicoEstudo.length - 1].data
      : null;

    const datas = historicoEstudo.map(h => h.data);
    const diasConsecutivosEstudo = this.getDiasConsecutivos(datas);
    const sequenciaAtualDiasConsecutivos = this.getSequenciaAtualConsecutiva(datas);

    const cursosPorCategoria = this.getCursosPorCategoria(inscricoesAtivas);
    const notasMediasPorCurso = await this.getNotasMedias(inscricoes);
    const tempoTotalEstudoMinutos = this.getTempoTotalEstudado(inscricoes);
    const avaliacoes = await this.getAvaliacoesPorUsuario(usuarioId, inscricoes);

    return {
      totalCursosInscritos: inscricoesAtivas.length,
      totalCertificados: certificados.length,
      progressoPorCurso,
      historicoEstudo,
      cursosPorCategoria,
      notasMediasPorCurso,
      tempoTotalEstudoMinutos,
      avaliacoes,
      diasAtivosEstudo,
      ultimoDiaAtividade,
      diasConsecutivosEstudo,
      sequenciaAtualDiasConsecutivos,
    };
  }

  private getHistoricoEstudo(inscricoes: any[]) {
    const progresso = inscricoes.flatMap((i) => i?.progressoAulas ?? []);
    const agrupado = progresso
      .filter((p) => p?.dataConclusao)
      .reduce((acc, p) => {
        const data = p.dataConclusao?.toISOString().split('T')[0] ?? '';
        acc[data] = (acc[data] || 0) + (p?.aula?.tempoAula ?? 0);
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(agrupado)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([data, minutosEstudados]) => ({
        data,
        minutosEstudados: Number(minutosEstudados),
      }));
  }

  private getDiasConsecutivos(datas: string[]): number {
    if (datas.length === 0) return 0;

    const dias = datas.map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
    let streak = 1;
    let maxStreak = 1;

    for (let i = 1; i < dias.length; i++) {
      const diff = (dias[i].getTime() - dias[i - 1].getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else if (diff > 1) {
        streak = 1;
      }
    }

    return maxStreak;
  }

  private getSequenciaAtualConsecutiva(datas: string[]): number {
    const diasEstudoSet = new Set(datas);
    let hoje = new Date();
    let contador = 0;

    while (true) {
      const dataStr = hoje.toISOString().split('T')[0];
      if (diasEstudoSet.has(dataStr)) {
        contador++;
        hoje.setDate(hoje.getDate() - 1);
      } else {
        break;
      }
    }

    return contador;
  }

  private getCursosPorCategoria(inscricoes: any[]) {
    const agrupado = inscricoes.reduce((acc, i) => {
      const categoria = i?.curso?.categoria ?? 'Outros';
      acc[categoria] = (acc[categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(agrupado).map(([categoria, total]) => ({
      categoria,
      total: Number(total),
    }));
  }

  private async getNotasMedias(inscricoes: any[]) {
    return Promise.all(
      inscricoes.map(async (i) => {
        const cursoId = i?.curso?.id ?? 0;
        const nomeCurso = i?.curso?.nomeCurso ?? '';
        const notaMedia = await this.avaliacaoRepo.getCourseAverage(cursoId);
        return { cursoId, nomeCurso, notaMedia };
      })
    );
  }

  private getTempoTotalEstudado(inscricoes: any[]) {
    const progresso = inscricoes.flatMap((i) => i?.progressoAulas ?? []);
    return progresso
      .filter((p) => p?.concluida && p?.aula?.tempoAula)
      .reduce((soma, p) => soma + (p?.aula?.tempoAula ?? 0), 0);
  }

  private async getAvaliacoesPorUsuario(usuarioId: number, inscricoes: any[]) {
    return Promise.all(
      inscricoes.map(async (i) => {
        const cursoId = i?.curso?.id ?? 0;
        const nomeCurso = i?.curso?.nomeCurso ?? '';
        const avaliacao = await this.avaliacaoRepo.findByUserAndCourse(usuarioId, cursoId);
        return {
          cursoId,
          nomeCurso,
          avaliacaoFeita: !!avaliacao,
        };
      })
    );
  }
}
