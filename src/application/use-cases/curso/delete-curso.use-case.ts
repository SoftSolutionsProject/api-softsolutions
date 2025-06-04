import { Injectable, NotFoundException } from '@nestjs/common';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';

@Injectable()
export class DeleteCursoUseCase {
  constructor(private readonly cursoRepo: CursoRepository) {}

  async execute(id: number): Promise<{ message: string }> {
    const curso = await this.cursoRepo.findById(id);
    if (!curso) throw new NotFoundException('Curso não encontrado');
    await this.cursoRepo.delete(id);
    return { message: 'Curso removido com sucesso' };
  }
}