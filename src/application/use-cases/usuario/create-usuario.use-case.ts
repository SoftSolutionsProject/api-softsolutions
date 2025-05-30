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
    if (!this.validarCpf(data.cpfUsuario))
      throw new BadRequestException('CPF inválido');

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

  private validarCpf(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }
}
