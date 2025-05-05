import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscricao } from '../../../domain/inscricao/inscricao.entity';
import { ProgressoAula } from '../../../domain/inscricao/progresso-aula.entity';
import { InscricaoService } from '../../../application/inscricao/use-cases/inscricao.service';
import { InscricaoController } from './inscricao.controller';
import { Curso } from '../../../domain/curso/curso.entity';
import { Aula } from '../../../domain/aula/aula.entity';
import { Usuario } from '../../../domain/usuario/usuario.entity';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inscricao, 
      ProgressoAula,
      Curso,
      Aula,
      Usuario
    ]),
    AuthModule,
  ],
  controllers: [InscricaoController],
  providers: [InscricaoService],
})
export class InscricaoModule {}