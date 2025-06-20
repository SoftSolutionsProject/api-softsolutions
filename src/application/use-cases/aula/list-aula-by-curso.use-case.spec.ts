import { ListAulaByCursoUseCase } from './list-aula-by-curso.use-case';
import { AulaRepository } from '../../../infrastructure/database/repositories/aula.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { NotFoundException } from '@nestjs/common';

describe('ListAulaByCursoUseCase', () => {
  let useCase: ListAulaByCursoUseCase;
  let aulaRepo: jest.Mocked<AulaRepository>;
  let cursoRepo: jest.Mocked<CursoRepository>;

  beforeEach(() => {
    aulaRepo = { findByCurso: jest.fn() } as any;
    cursoRepo = { findById: jest.fn() } as any;

    useCase = new ListAulaByCursoUseCase(aulaRepo, cursoRepo);
  });

  it('deve lançar exceção se o curso não existir', async () => {
    cursoRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });

  it('deve retornar lista de aulas se o curso existir', async () => {
    cursoRepo.findById.mockResolvedValue({ id: 1 } as any);
    aulaRepo.findByCurso.mockResolvedValue([{ id: 1, nomeAula: 'Aula Teste' }] as any);

    const result = await useCase.execute(1);
    expect(result).toEqual([{ id: 1, nomeAula: 'Aula Teste' }]);
  });
});
