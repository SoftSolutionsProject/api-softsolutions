import { Injectable, NotFoundException } from '@nestjs/common';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { ProgressoAulaRepository } from '../../../infrastructure/database/repositories/progresso-aula.repository';

@Injectable()
export class VerProgressoUseCase {
  constructor(
    private readonly inscricaoRepo: InscricaoRepository,
    private readonly progressoRepo: ProgressoAulaRepository,
  ) {}

  async execute(idInscricao: number, idUsuario: number) {
    const inscricao = await this.inscricaoRepo.findById(idInscricao);
    if (!inscricao || inscricao.usuario.id !== idUsuario) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    const totalAulas = inscricao.curso.modulos?.reduce(
      (total, modulo) => total + (modulo.aulas?.length || 0), 0
    ) || 0;

    const aulasConcluidas = await this.progressoRepo.countConcluidasByInscricao(idInscricao);
    const progresso = totalAulas > 0 ? (aulasConcluidas / totalAulas) * 100 : 0;

    return { progresso, aulasConcluidas, totalAulas };
  }
}