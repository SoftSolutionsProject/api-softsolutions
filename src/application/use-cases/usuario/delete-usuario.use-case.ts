import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../../domain/models/usuario.model';

@Injectable()
export class DeleteUsuarioUseCase {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async execute(id: number): Promise<{ message: string }> {
    const usuario = await this.usuarioRepo.findOneBy({ id });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    await this.usuarioRepo.remove(usuario);
    return { message: 'Usuário removido com sucesso' };
  }
}
