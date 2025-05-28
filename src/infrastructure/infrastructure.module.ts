import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../domain/models/usuario.model';
import { Curso } from '../domain/models/curso.model';
import { Modulo as ModuloEntity } from '../domain/models/modulo.model';
import { Aula } from '../domain/models/aula.model';
import { Inscricao } from '../domain/models/inscricao.model';
import { ProgressoAula } from '../domain/models/progresso-aula.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Curso,
      ModuloEntity,
      Aula,
      Inscricao,
      ProgressoAula,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class InfrastructureModule {}
