// src/interfaces/http/curso/curso.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from '../../../domain/curso/curso.entity';
import { CursoService } from '../../../application/curso/use-cases/curso.service';
import { CursoController } from './curso.controller';
import { AuthModule } from '../auth/auth.module';
import { AulaModule } from '../aula/aula.module';
import { AulaService } from '../../../application/aula/use-cases/aula.service';
import { Modulo } from 'src/domain/modulo/modulo.entity';
import { Inscricao } from 'src/domain/inscricao/inscricao.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Curso, Modulo, Inscricao]),
    AuthModule,
    AulaModule
  ],
  controllers: [CursoController],
  providers: [CursoService],
  exports: [CursoService],
})
export class CursoModule {}