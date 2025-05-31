import { Injectable, NotFoundException } from '@nestjs/common';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';

@Injectable()
export class ListarInscricoesUseCase {
  constructor(
    private readonly inscricaoRepo: InscricaoRepository,
    private readonly usuarioRepo: UsuarioRepository,
  ) {}

  async execute(idUsuario: number) {
    const usuario = await this.usuarioRepo.findById(idUsuario);
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    return this.inscricaoRepo.findByUsuario(idUsuario);
  }
}