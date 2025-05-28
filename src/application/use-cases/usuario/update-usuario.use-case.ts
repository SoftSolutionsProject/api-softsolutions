import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../../domain/models/usuario.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateUsuarioUseCase {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async execute(id: number, data: Partial<Usuario>): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOneBy({ id });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    if (data.cpfUsuario && data.cpfUsuario !== usuario.cpfUsuario)
      throw new BadRequestException('Não é permitido alterar o CPF');

    if (data.tipo && data.tipo !== usuario.tipo)
      delete data.tipo; // bloqueia alteração de tipo

    if (data.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email))
      throw new BadRequestException('Email inválido');

    if (data.telefone && !this.validarTelefone(data.telefone))
      throw new BadRequestException('Telefone inválido');

    if (data.telefone) data.telefone = this.formatarTelefone(data.telefone);

    if (data.senha && !(await bcrypt.compare(data.senha, usuario.senha))) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    await this.usuarioRepo.update(id, data);
    const atualizado = await this.usuarioRepo.findOneBy({ id });
    if (!atualizado) throw new NotFoundException('Erro ao atualizar');

    const { senha, ...result } = atualizado;
    return result as Usuario;
  }

  private validarTelefone(tel: string): boolean {
    const t = tel.replace(/\D/g, '');
    return t.length === 10 || t.length === 11;
  }

  private formatarTelefone(tel: string): string {
    const t = tel.replace(/\D/g, '');
    return t.length === 11
      ? t.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      : t.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
}
