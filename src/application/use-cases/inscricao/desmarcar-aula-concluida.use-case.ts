import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { ProgressoAulaRepository } from '../../../infrastructure/database/repositories/progresso-aula.repository';
import { AulaRepository } from '../../../infrastructure/database/repositories/aula.repository';
import { CertificadoRepository } from '../../../infrastructure/database/repositories/certificado.repository';

@Injectable()
export class DesmarcarAulaConcluidaUseCase {
  constructor(
    private readonly inscricaoRepo: InscricaoRepository,
    private readonly progressoRepo: ProgressoAulaRepository,
    private readonly aulaRepo: AulaRepository,
    private readonly certificadoRepo: CertificadoRepository,
  ) {}

  async execute(idInscricao: number, idAula: number, idUsuario: number) {
    const inscricao = await this.inscricaoRepo.findById(idInscricao);
    if (!inscricao || inscricao.usuario.id !== idUsuario) {
      throw new NotFoundException('Inscrição não encontrada ou não pertence ao usuário');
    }

    // Verificar se já existe certificado emitido para esta inscrição
    const certificado = await this.certificadoRepo.findByInscricao(inscricao);
    if (certificado) {
      throw new BadRequestException('Não é possível desmarcar aulas como concluídas após a emissão do certificado');
    }

    const aula = await this.aulaRepo.findByIdWithModuloAndCurso(idAula);
    if (!aula || aula.modulo?.curso?.id !== inscricao.curso.id) {
      throw new BadRequestException('Aula não pertence ao curso da inscrição');
    }

    const progresso = await this.progressoRepo.findByInscricaoAndAula(idInscricao, idAula);
    if (!progresso) throw new NotFoundException('Progresso não encontrado');

    progresso.concluida = false;
    progresso.dataConclusao = undefined;

    return this.progressoRepo.update(progresso.id!, progresso);
  }
}