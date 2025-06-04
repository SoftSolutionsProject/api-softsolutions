import { Injectable, NotFoundException } from '@nestjs/common';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { CursoModel } from 'src/domain/models/curso.model';

@Injectable()
export class UpdateCursoUseCase {
  constructor(private readonly cursoRepo: CursoRepository) {}

  async execute(id: number, data: Partial<CursoModel>) {
    const curso = await this.cursoRepo.findById(id);
    if (!curso) throw new NotFoundException('Curso não encontrado');
    return this.cursoRepo.update(id, data);
  }
}