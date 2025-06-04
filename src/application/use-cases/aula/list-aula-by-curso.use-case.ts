import { Injectable, NotFoundException } from '@nestjs/common';
import { AulaRepository } from 'src/infrastructure/database/repositories/aula.repository';
import { CursoRepository } from 'src/infrastructure/database/repositories/curso.repository';

@Injectable()
export class ListAulaByCursoUseCase {
  constructor(
    private readonly aulaRepo: AulaRepository,
    private readonly cursoRepo: CursoRepository,
  ) {}

  async execute(idCurso: number) {
    const curso = await this.cursoRepo.findById(idCurso);
    if (!curso) throw new NotFoundException('Curso não encontrado');
    
    return this.aulaRepo.findByCurso(idCurso);
  }
}