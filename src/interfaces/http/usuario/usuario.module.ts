import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../../domain/usuario/usuario.entity';
import { UsuarioService } from '../../../application/usuario/use-cases/usuario.service';
import { UsuarioController } from './usuario.controller';
import { Inscricao } from 'src/domain/inscricao/inscricao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Inscricao])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}