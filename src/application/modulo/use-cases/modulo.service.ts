import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modulo } from '../../../domain/modulo/modulo.entity';
import { Curso } from '../../../domain/curso/curso.entity';
import { CreateModuloDto } from '../dtos/create-modulo.dto';

@Injectable()
export class ModuloService {
  constructor(
    @InjectRepository(Modulo)
    private readonly moduloRepo: Repository<Modulo>,
    @InjectRepository(Curso)
    private readonly cursoRepo: Repository<Curso>,
  ) {}

  async create(dto: CreateModuloDto): Promise<Modulo> {
    const curso = await this.cursoRepo.findOne({ where: { id: dto.idCurso } });
    if (!curso) throw new NotFoundException('Curso não encontrado');

    const modulo = this.moduloRepo.create({
      nomeModulo: dto.nomeModulo,
      tempoModulo: dto.tempoModulo,
      curso,
    });
    return this.moduloRepo.save(modulo);
  }
}
