import { CreateModuloUseCase } from './create-modulo.use-case';
import { ModuloRepository } from '../../../infrastructure/database/repositories/modulo.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { NotFoundException } from '@nestjs/common';

describe('CreateModuloUseCase', () => {
  let useCase: CreateModuloUseCase;
  let moduloRepo: jest.Mocked<ModuloRepository>;
  let cursoRepo: jest.Mocked<CursoRepository>;

  beforeEach(() => {
    moduloRepo = { create: jest.fn() } as any;
    cursoRepo = { findById: jest.fn() } as any;
    useCase = new CreateModuloUseCase(moduloRepo, cursoRepo);
  });

  it('deve lançar exceção se curso não existir', async () => {
    cursoRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute({
      nomeModulo: 'Módulo Teste',
      tempoModulo: 100,
      idCurso: 1
    })).rejects.toThrow(NotFoundException);
  });

  it('deve criar módulo se curso existir', async () => {
    cursoRepo.findById.mockResolvedValue({ id: 1 } as any);
    moduloRepo.create.mockResolvedValue({ id: 1, nomeModulo: 'Módulo Teste' } as any);

    const result = await useCase.execute({
      nomeModulo: 'Módulo Teste',
      tempoModulo: 100,
      idCurso: 1
    });

    expect(result).toHaveProperty('id');
    expect(moduloRepo.create).toHaveBeenCalledWith({
      nomeModulo: 'Módulo Teste',
      tempoModulo: 100,
      curso: { id: 1 }
    });
  });
});
