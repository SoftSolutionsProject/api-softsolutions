import { GetModuloByIdUseCase } from './get-modulo-by-id.use-case';
import { ModuloRepository } from '../../../infrastructure/database/repositories/modulo.repository';
import { NotFoundException } from '@nestjs/common';

describe('GetModuloByIdUseCase', () => {
  let useCase: GetModuloByIdUseCase;
  let moduloRepo: jest.Mocked<ModuloRepository>;

  beforeEach(() => {
    moduloRepo = { findById: jest.fn() } as any;
    useCase = new GetModuloByIdUseCase(moduloRepo);
  });

  it('deve lançar exceção se módulo não for encontrado', async () => {
    moduloRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });

  it('deve retornar módulo se encontrado', async () => {
    const moduloMock = { id: 1, nomeModulo: 'Teste' };
    moduloRepo.findById.mockResolvedValue(moduloMock as any);

    const result = await useCase.execute(1);
    expect(result).toEqual(moduloMock);
  });
});
