import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './database/entities/usuario.entity';
import { UsuarioRepository } from './database/repositories/usuario.repository';
import { CursoEntity } from './database/entities/curso.entity';
import { CursoRepository } from './database/repositories/curso.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, CursoEntity])],
  providers: [UsuarioRepository, CursoRepository],
  exports: [UsuarioRepository, CursoRepository],
})
export class InfrastructureModule {}