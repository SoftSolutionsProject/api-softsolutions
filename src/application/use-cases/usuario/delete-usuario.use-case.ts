import { Injectable, NotFoundException } from '@nestjs/common';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';

@Injectable()
export class DeleteUsuarioUseCase {
  constructor(private readonly usuarioRepo: UsuarioRepository) {}

  async execute(id: number): Promise<{ message: string }> {
    const usuario = await this.usuarioRepo.findById(id);
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    await this.usuarioRepo.delete(id);
    return { message: 'Usuário removido com sucesso' };
  }
}