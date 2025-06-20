import { NotFoundException } from '@nestjs/common';
import { GetCursoByIdUseCase } from './get-curso-by-id.use-case';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';

describe('GetCursoByIdUseCase', () => {
  let useCase: GetCursoByIdUseCase;
  let repo: jest.Mocked<CursoRepository>;

  beforeEach(() => {
    repo = { findById: jest.fn() } as any;
    useCase = new GetCursoByIdUseCase(repo);
  });

  it('deve retornar o curso se existir', async () => {
    const curso = { id: 1, nomeCurso: 'Curso Teste' } as any;
    repo.findById.mockResolvedValue(curso);
    const result = await useCase.execute(1);
    expect(result).toEqual(curso);
    expect(repo.findById).toHaveBeenCalledWith(1);
  });

  it('deve lançar NotFoundException se não existir', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });
});
