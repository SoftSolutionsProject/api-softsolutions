import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../../domain/models/usuario.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUsuarioUseCase {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async execute(data: {
    nomeUsuario: string;
    cpfUsuario: string;
    email: string;
    senha: string;
    telefone?: string;
    endereco?: any;
    localizacao?: any;
    tipo?: 'aluno' | 'administrador';
  }): Promise<Usuario> {
    if (!this.validarCPF(data.cpfUsuario)) throw new BadRequestException('CPF inválido');
    if (!this.validarEmail(data.email)) throw new BadRequestException('Email inválido');
    if (data.telefone && !this.validarTelefone(data.telefone))
      throw new BadRequestException('Telefone inválido');

    const emailExistente = await this.usuarioRepo.findOneBy({ email: data.email });
    if (emailExistente) throw new BadRequestException('Email já cadastrado.');

    const cpfExistente = await this.usuarioRepo.findOneBy({ cpfUsuario: data.cpfUsuario });
    if (cpfExistente) throw new BadRequestException('CPF já cadastrado.');

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const usuario = this.usuarioRepo.create({
      ...data,
      tipo: 'aluno',
      senha: senhaHash,
      telefone: data.telefone ? this.formatarTelefone(data.telefone) : undefined,
    });

    const salvo = await this.usuarioRepo.save(usuario);
    const { senha, ...result } = salvo;
    return result as Usuario;
  }

  private validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf[10]);
  }

  private validarEmail(email: string): boolean {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
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
