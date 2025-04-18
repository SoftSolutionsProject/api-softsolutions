import {
  Injectable, UnauthorizedException, BadRequestException, NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(data: CreateUsuarioDto): Promise<Usuario> {
    if (!this.validarCPF(data.cpfUsuario)) throw new BadRequestException('CPF inválido.');
    if (!this.validarEmail(data.email)) throw new BadRequestException('Email inválido.');
    if (data.telefone && !this.validarTelefone(data.telefone))
      throw new BadRequestException('Telefone inválido. Use 10 ou 11 dígitos.');

    const emailExistente = await this.usuarioRepository.findOneBy({ email: data.email });
    if (emailExistente) throw new BadRequestException('Email já cadastrado.');

    const cpfExistente = await this.usuarioRepository.findOneBy({ cpfUsuario: data.cpfUsuario });
    if (cpfExistente) throw new BadRequestException('CPF já cadastrado.');

    const hashedPassword = await bcrypt.hash(data.senha, 10);
    const novoUsuario = this.usuarioRepository.create({
      ...data,
      tipo: 'aluno',
      telefone: data.telefone ? this.formatarTelefone(data.telefone) : undefined,
      senha: hashedPassword,
    });

    const salvo = await this.usuarioRepository.save(novoUsuario);
    return this.omitirSenha(salvo);
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return this.omitirSenha(usuario);
  }

  async update(id: number, data: Partial<CreateUsuarioDto>): Promise<Usuario> {
    const usuarioAtual = await this.usuarioRepository.findOneBy({ id });
    if (!usuarioAtual) throw new NotFoundException('Usuário não encontrado');

    if (data.cpfUsuario && data.cpfUsuario !== usuarioAtual.cpfUsuario)
      throw new BadRequestException('Não é permitido alterar o CPF');

    if (data.email && !this.validarEmail(data.email))
      throw new BadRequestException('Email inválido');

    if (data.telefone && !this.validarTelefone(data.telefone))
      throw new BadRequestException('Telefone inválido');

    if (data.telefone) data.telefone = this.formatarTelefone(data.telefone);

    await this.usuarioRepository.update(id, data);
    const atualizado = await this.usuarioRepository.findOneBy({ id });
    if (!atualizado) throw new NotFoundException('Erro ao atualizar');
    return this.omitirSenha(atualizado);
  }

  async login(email: string, senha: string): Promise<{ usuario: Usuario; token: string }> {
    const usuario = await this.usuarioRepository.findOneBy({ email });
    if (!usuario) throw new UnauthorizedException('Email ou senha inválidos');

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) throw new UnauthorizedException('Email ou senha inválidos');

    const payload = { sub: usuario.id, email: usuario.email, tipo: usuario.tipo };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' });

    return { usuario: this.omitirSenha(usuario), token };
  }

  private omitirSenha(usuario: Usuario): Usuario {
    const { senha, ...semSenha } = usuario;
    return semSenha as Usuario;
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

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.usuarioRepository.find();
    return usuarios.map(this.omitirSenha);
  }
  
}
