import { ListAulaByModuloUseCase } from './list-aula-by-modulo.use-case';
import { AulaRepository } from '../../../infrastructure/database/repositories/aula.repository';
import { ModuloRepository } from '../../../infrastructure/database/repositories/modulo.repository';
import { NotFoundException } from '@nestjs/common';

describe('ListAulaByModuloUseCase', () => {
  let useCase: ListAulaByModuloUseCase;
  let aulaRepo: jest.Mocked<AulaRepository>;
  let moduloRepo: jest.Mocked<ModuloRepository>;

  beforeEach(() => {
    aulaRepo = { findByModulo: jest.fn() } as any;
    moduloRepo = { findById: jest.fn() } as any;

    useCase = new ListAulaByModuloUseCase(aulaRepo, moduloRepo);
  });

  it('deve lançar exceção se o módulo não existir', async () => {
    moduloRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });

  it('deve retornar lista de aulas se o módulo existir', async () => {
    moduloRepo.findById.mockResolvedValue({ id: 1 } as any);
    aulaRepo.findByModulo.mockResolvedValue([{ id: 1, nomeAula: 'Teste' }] as any);

    const result = await useCase.execute(1);
    expect(result).toEqual([{ id: 1, nomeAula: 'Teste' }]);
  });
});
