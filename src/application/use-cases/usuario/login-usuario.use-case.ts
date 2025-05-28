import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../../domain/models/usuario.model';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LoginUsuarioUseCase {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async execute(email: string, senha: string): Promise<{ usuario: Usuario; token: string }> {
    const usuario = await this.usuarioRepo.findOneBy({ email });
    if (!usuario) throw new UnauthorizedException('Email ou senha inválidos');

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) throw new UnauthorizedException('Email ou senha inválidos');

    const payload = { sub: usuario.id, email: usuario.email, tipo: usuario.tipo };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' });

    const { senha: _, ...usuarioSemSenha } = usuario;
    return { usuario: usuarioSemSenha as Usuario, token };
  }
}
