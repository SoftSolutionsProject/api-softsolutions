import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './database/entities/usuario.entity';
import { UsuarioRepository } from './database/repositories/usuario.repository';
import { CursoEntity } from './database/entities/curso.entity';
import { CursoRepository } from './database/repositories/curso.repository';
import { ModuloEntity } from './database/entities/modulo.entity';
import { ModuloRepository } from './database/repositories/modulo.repository';
import { AulaEntity } from './database/entities/aula.entity';
import { AulaRepository } from './database/repositories/aula.repository';



@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, CursoEntity, ModuloEntity, AulaEntity])],
  providers: [UsuarioRepository, CursoRepository, ModuloRepository, AulaRepository],
  exports: [UsuarioRepository, CursoRepository, ModuloRepository, AulaRepository],
})
export class InfrastructureModule {}