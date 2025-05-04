// src/interfaces/http/aula/aula.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aula } from '../../../domain/aula/aula.entity';
import { Modulo } from '../../../domain/modulo/modulo.entity';
import { AulaService } from '../../../application/aula/use-cases/aula.service';
import { AulaController } from './aula.controller';
import { AuthModule } from '../auth/auth.module';
import { Curso } from '../../../domain/curso/curso.entity';
import { ProgressoAula } from 'src/domain/inscricao/progresso-aula.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Aula, Modulo, Curso, ProgressoAula]),
    AuthModule,
  ],
  controllers: [AulaController],
  providers: [AulaService],
  exports: [AulaService], // Adicione esta linha
})
export class AulaModule {}