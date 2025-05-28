import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';

@Injectable()
export class UpdateUsuarioUseCase {
  constructor(private readonly usuarioRepo: UsuarioRepository) {}

  async execute(id: number, data: any) {
    const usuario = await this.usuarioRepo.findById(id);
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    if (data.cpfUsuario && data.cpfUsuario !== usuario.cpfUsuario)
      throw new BadRequestException('Não é permitido alterar o CPF');

    if (data.tipo && data.tipo !== usuario.tipo) delete data.tipo;
    if (data.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email))
      throw new BadRequestException('Email inválido');
    if (data.telefone && !this.validarTelefone(data.telefone))
      throw new BadRequestException('Telefone inválido');

    if (data.telefone) data.telefone = this.formatarTelefone(data.telefone);

    if (data.senha && !(await bcrypt.compare(data.senha, usuario.senha))) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    const atualizado = await this.usuarioRepo.update(id, data);
    const { senha, ...result } = atualizado;
    return result;
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