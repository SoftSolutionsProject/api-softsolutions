import { BadRequestException, Injectable } from '@nestjs/common';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import * as bcrypt from 'bcrypt';
@Injectable()
export class CreateUsuarioUseCase {
  constructor(private readonly usuarioRepo: UsuarioRepository) {}

  async execute(data: {
    nomeUsuario: string;
    cpfUsuario: string;
    email: string;
    senha: string;
    telefone?: string;
    endereco?: any;
    localizacao?: any;
    tipo?: 'aluno' | 'administrador';
  }) {
    if (await this.usuarioRepo.findByEmail(data.email))
      throw new BadRequestException('Email já cadastrado');

    if (await this.usuarioRepo.findByCpf(data.cpfUsuario))
      throw new BadRequestException('CPF já cadastrado');

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const usuario = await this.usuarioRepo.create({
      ...data,
      senha: senhaHash,
      tipo: 'aluno',
      telefone: data.telefone ? this.formatarTelefone(data.telefone) : undefined,
    });

    const { senha, ...result } = usuario;
    return result;
  }

  private formatarTelefone(tel: string): string {
    const t = tel.replace(/\D/g, '');
    return t.length === 11
      ? t.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      : t.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
}
