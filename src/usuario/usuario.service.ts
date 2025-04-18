import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(data: CreateUsuarioDto): Promise<Usuario> {
    const novoUsuario = this.usuarioRepository.create(data);
    return await this.usuarioRepository.save(novoUsuario);
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    return usuario;
  }

  async update(id: number, data: Partial<CreateUsuarioDto>): Promise<Usuario> {
    await this.usuarioRepository.update(id, data);
    return this.findById(id);
  }
}
