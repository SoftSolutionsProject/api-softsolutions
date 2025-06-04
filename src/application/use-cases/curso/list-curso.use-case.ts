import { Injectable } from '@nestjs/common';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';

@Injectable()
export class ListCursoUseCase {
  constructor(private readonly cursoRepo: CursoRepository) {}

  async execute() {
    return await this.cursoRepo.findAll();
  }
}