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
import { InscricaoEntity } from './database/entities/inscricao.entity';
import { ProgressoAulaEntity } from './database/entities/progresso-aula.entity';
import { InscricaoRepository } from './database/repositories/inscricao.repository';
import { ProgressoAulaRepository } from './database/repositories/progresso-aula.repository';



@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, CursoEntity, ModuloEntity, AulaEntity, InscricaoEntity, ProgressoAulaEntity])],
  providers: [UsuarioRepository, CursoRepository, ModuloRepository, AulaRepository, InscricaoRepository, ProgressoAulaRepository,],
  exports: [UsuarioRepository, CursoRepository, ModuloRepository, AulaRepository, InscricaoRepository,ProgressoAulaRepository,],
})
export class InfrastructureModule {}