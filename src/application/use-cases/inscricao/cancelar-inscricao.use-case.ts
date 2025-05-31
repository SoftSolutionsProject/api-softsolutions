// cancelar-inscricao.use-case.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';

@Injectable()
export class CancelarInscricaoUseCase {
  constructor(private readonly inscricaoRepo: InscricaoRepository) {}

  async execute(idUsuario: number, idInscricao: number, isAdmin: boolean = false) {
    const inscricao = await this.inscricaoRepo.findById(idInscricao);
    
    if (!inscricao) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    if (!isAdmin && inscricao.usuario.id !== idUsuario) {
      throw new NotFoundException('Inscrição não encontrada ou não pertence ao usuário');
    }

    await this.inscricaoRepo.update(idInscricao, { status: 'cancelado' });
    return { message: 'Inscrição cancelada com sucesso' };
  }
}