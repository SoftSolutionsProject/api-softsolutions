import { Injectable } from '@nestjs/common';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';

@Injectable()
export class CreateCursoUseCase {
  constructor(private readonly cursoRepo: CursoRepository) {}

  async execute(data: {
    nomeCurso: string;
    tempoCurso: number;
    descricaoCurta: string;
    descricaoDetalhada: string;
    professor: string;
    categoria: string;
    status?: 'ativo' | 'inativo';
    avaliacao?: number;
    imagemCurso: string;
  }) {
    return this.cursoRepo.create({
      status: 'ativo',
      avaliacao: 0,
      ...data,
    });
  }
}