import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../entities/usuario.entity';
import { UsuarioModel } from 'src/domain/models/usuario.model';

@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly repo: Repository<UsuarioEntity>,
  ) {}

  async create(data: Partial<UsuarioModel>): Promise<UsuarioModel> {
    const usuario = this.repo.create(data);
    return this.repo.save(usuario);
  }

  async findByEmail(email: string): Promise<UsuarioModel | null> {
    return await this.repo.findOne({ where: { email } });
  }

  async findByCpf(cpf: string): Promise<UsuarioModel | null> {
    return await this.repo.findOne({ where: { cpfUsuario: cpf } });
  }

  async findById(id: number): Promise<UsuarioModel | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findAll(): Promise<UsuarioModel[]> {
    return await this.repo.find();
  }

  async update(id: number, data: Partial<UsuarioModel>): Promise<UsuarioModel> {
    await this.repo.update(id, data);
    return (await this.findById(id))!;
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
