import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modulo } from '../../../domain/modulo/modulo.entity';
import { Curso } from '../../../domain/curso/curso.entity';
import { ModuloService } from '../../../application/modulo/use-cases/modulo.service';
import { ModuloController } from './modulo.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Modulo, Curso])],
    controllers: [ModuloController],
    providers: [ModuloService],
})
export class ModuloModule { }