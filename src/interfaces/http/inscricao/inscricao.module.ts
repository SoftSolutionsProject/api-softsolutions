import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscricao } from '../../../domain/inscricao/inscricao.entity';
import { InscricaoService } from '../../../application/inscricao/use-cases/inscricao.service';
import { InscricaoController } from './inscricao.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inscricao])],
  controllers: [InscricaoController],
  providers: [InscricaoService],
})
export class InscricaoModule {}