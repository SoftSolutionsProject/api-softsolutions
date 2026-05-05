import { NotFoundException } from '@nestjs/common';
import { DeleteCursoUseCase } from './delete-curso.use-case';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';

describe('DeleteCursoUseCase', () => {
  let useCase: DeleteCursoUseCase;
  let repo: jest.Mocked<CursoRepository>;

  beforeEach(() => {
    repo = { findById: jest.fn(), delete: jest.fn() } as any;
    useCase = new DeleteCursoUseCase(repo);
  });

  it('deve deletar curso se existir', async () => {
    repo.findById.mockResolvedValue({
      id: 1,
      nomeCurso: 'Curso Teste',
    } as any);
    repo.delete.mockResolvedValue(undefined);

    await expect(useCase.execute(1)).resolves.toEqual({
      message: 'Curso removido com sucesso',
    });
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('deve lançar erro quando o curso não existir', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
