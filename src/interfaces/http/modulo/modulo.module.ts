import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modulo } from '../../../domain/modulo/modulo.entity';
import { Curso } from '../../../domain/curso/curso.entity';
import { ModuloService } from '../../../application/modulo/use-cases/modulo.service';
import { ModuloController } from './modulo.controller';
import { AuthModule } from '../auth/auth.module'; 

@Module({
    imports: [TypeOrmModule.forFeature([Modulo, Curso]), AuthModule,],
    controllers: [ModuloController],
    providers: [ModuloService],
})
export class ModuloModule { }