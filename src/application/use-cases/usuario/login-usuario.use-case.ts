import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginUsuarioResponseDto } from 'src/interfaces/http/dtos/responses/login-usuario.response.dto';

@Injectable()
export class LoginUsuarioUseCase {
  constructor(private readonly usuarioRepo: UsuarioRepository) {}

  async execute(email: string, senha: string) {
    const usuario = await this.usuarioRepo.findByEmail(email);
    if (!usuario) throw new UnauthorizedException('Email ou senha inválidos');

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) throw new UnauthorizedException('Email ou senha inválidos');

    const payload = { sub: usuario.id, email: usuario.email, tipo: usuario.tipo };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' });

    const { senha: _, ...usuarioSemSenha } = usuario;
    return new LoginUsuarioResponseDto(token);
  }
}
