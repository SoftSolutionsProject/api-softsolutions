import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ModuloRepository } from '../../../infrastructure/database/repositories/modulo.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';

@Injectable()
export class CreateModuloUseCase {
  constructor(
    private readonly moduloRepo: ModuloRepository,
    private readonly cursoRepo: CursoRepository,
  ) {}

  async execute(data: { nomeModulo: string; tempoModulo: number; idCurso: number }) {
    const curso = await this.cursoRepo.findById(data.idCurso);
    if (!curso) throw new NotFoundException('Curso não encontrado');

    return this.moduloRepo.create({
      nomeModulo: data.nomeModulo,
      tempoModulo: data.tempoModulo,
      curso,
    });
  }
}