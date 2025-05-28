import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../../domain/models/usuario.model';

@Injectable()
export class ListUsuarioUseCase {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async execute(): Promise<Usuario[]> {
    const usuarios = await this.usuarioRepo.find();
    return usuarios.map(({ senha, ...rest }) => rest as Usuario);
  }
}
