import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './database/entities/usuario.entity';
import { UsuarioRepository } from './database/repositories/usuario.repository';
import { CursoEntity } from './database/entities/curso.entity';
import { CursoRepository } from './database/repositories/curso.repository';
import { ModuloEntity } from './database/entities/modulo.entity';
import { ModuloRepository } from './database/repositories/modulo.repository';



@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, CursoEntity, ModuloEntity])],
  providers: [UsuarioRepository, CursoRepository, ModuloRepository],
  exports: [UsuarioRepository, CursoRepository, ModuloRepository],
})
export class InfrastructureModule {}