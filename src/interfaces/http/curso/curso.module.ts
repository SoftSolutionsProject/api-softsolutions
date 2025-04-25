import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from '../../../domain/curso/curso.entity';
import { CursoService } from '../../../application/curso/use-cases/curso.service';
import { CursoController } from './curso.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Curso])],
  controllers: [CursoController],
  providers: [CursoService],
  exports: [CursoService],
})
export class CursoModule {}