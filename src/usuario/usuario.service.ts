import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(data: CreateUsuarioDto): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(data.senha, 10);
    const novoUsuario = this.usuarioRepository.create({
      ...data,
      senha: hashedPassword,
    });
  
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

  async login(email: string, senha: string): Promise<{ usuario: Usuario; token: string }> {
    const usuario = await this.usuarioRepository.findOneBy({ email });
    if (!usuario) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }
  
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }
  
    const payload = { sub: usuario.id, email: usuario.email, tipo: usuario.tipo };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' });
  
    return { usuario, token };
  }

}
