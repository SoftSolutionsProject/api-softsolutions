import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { Usuario } from '../../../domain/usuario/usuario.entity';

interface JwtPayload {
  sub: number;
  email: string;
  tipo: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não fornecido');
    }
  
    const token = authHeader.split(' ')[1];
    try {
      // Decodifica o token e faz a verificação de tipo segura
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      
      if (typeof decoded !== 'object' || decoded === null) {
        throw new UnauthorizedException('Token inválido');
      }

      // Verificação manual da estrutura do payload
      const payload = decoded as unknown as JwtPayload;
      
      if (typeof payload.sub !== 'number' || 
          typeof payload.email !== 'string' || 
          typeof payload.tipo !== 'string') {
        throw new UnauthorizedException('Token com estrutura inválida');
      }

      const usuario = await this.usuarioRepo.findOneBy({ id: payload.sub });
      if (!usuario) {
        throw new UnauthorizedException('Usuário não encontrado');
      }
  
      req.user = {
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo,
      };
  
      return true;
    } catch (error) {
      console.error('Erro na autenticação:', error);
      throw new UnauthorizedException('Token inválido');
    }
  }
}