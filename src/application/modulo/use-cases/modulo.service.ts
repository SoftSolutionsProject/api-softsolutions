import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modulo } from '../../../domain/modulos/modulo.entity';
import { Curso } from '../../../domain/cursos/curso.entity';

@Injectable()
export class ModuloService {
  constructor(
    @InjectRepository(Modulo)
    private readonly moduloRepo: Repository<Modulo>,
    @InjectRepository(Curso)
    private readonly cursoRepo: Repository<Curso>,
  ) {}
}
