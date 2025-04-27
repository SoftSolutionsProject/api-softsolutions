import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aula } from '../../../domain/aula/aula.entity';
import { Modulo } from '../../../domain/modulo/modulo.entity';
import { AulaService } from '../../../application/aula/use-cases/aula.service';
import { AulaController } from './aula.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Aula, Modulo])],
  controllers: [AulaController],
  providers: [AulaService],
})
export class AulaModule {}