import { Injectable } from '@nestjs/common';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';

@Injectable()
export class ListUsuarioUseCase {
  constructor(private readonly usuarioRepo: UsuarioRepository) {}

  async execute() {
    const usuarios = await this.usuarioRepo.findAll();
    return usuarios.map(({ senha, ...rest }) => rest);
  }
}
