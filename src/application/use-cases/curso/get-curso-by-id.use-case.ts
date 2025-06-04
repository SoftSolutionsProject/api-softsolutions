import { Injectable, NotFoundException } from '@nestjs/common';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';

@Injectable()
export class GetCursoByIdUseCase {
  constructor(private readonly cursoRepo: CursoRepository) {}

  async execute(id: number) {
    const curso = await this.cursoRepo.findById(id);
    if (!curso) throw new NotFoundException('Curso não encontrado');
    return curso;
  }
}