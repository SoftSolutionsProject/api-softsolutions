import { Injectable, NotFoundException } from '@nestjs/common';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';

@Injectable()
export class GetUsuarioByIdUseCase {
  constructor(private readonly usuarioRepo: UsuarioRepository) {}

  async execute(id: number) {
    const usuario = await this.usuarioRepo.findById(id);
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const { senha, ...result } = usuario;
    return result;
  }
}
