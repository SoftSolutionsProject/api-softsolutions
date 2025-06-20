import { UpdateCursoUseCase } from './update-curso.use-case';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { NotFoundException } from '@nestjs/common';

describe('UpdateCursoUseCase', () => {
  let useCase: UpdateCursoUseCase;
  let repo: jest.Mocked<CursoRepository>;

  beforeEach(() => {
    repo = { findById: jest.fn(), update: jest.fn() } as any;
    useCase = new UpdateCursoUseCase(repo);
  });

  it('deve atualizar curso existente', async () => {
    repo.findById.mockResolvedValue({ id: 1 } as any);
    repo.update.mockResolvedValue({ id: 1, nomeCurso: 'Atualizado' } as any);

    const result = await useCase.execute(1, { nomeCurso: 'Atualizado' });
    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(repo.update).toHaveBeenCalledWith(1, { nomeCurso: 'Atualizado' });
    expect(result).toHaveProperty('nomeCurso', 'Atualizado');
  });

  it('deve lançar NotFoundException se curso não existir', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99, { nomeCurso: 'Teste' }))
      .rejects.toThrow(NotFoundException);
  });
});
