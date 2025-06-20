import { UpdateModuloUseCase } from './update-modulo.use-case';
import { ModuloRepository } from '../../../infrastructure/database/repositories/modulo.repository';
import { NotFoundException } from '@nestjs/common';

describe('UpdateModuloUseCase', () => {
  let useCase: UpdateModuloUseCase;
  let moduloRepo: jest.Mocked<ModuloRepository>;

  beforeEach(() => {
    moduloRepo = { findById: jest.fn(), update: jest.fn() } as any;
    useCase = new UpdateModuloUseCase(moduloRepo);
  });

  it('deve lançar exceção se módulo não existir', async () => {
    moduloRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1, { nomeModulo: 'Novo Nome' })).rejects.toThrow(NotFoundException);
  });

  it('deve atualizar módulo se existir', async () => {
    moduloRepo.findById.mockResolvedValue({ id: 1 } as any);
    moduloRepo.update.mockResolvedValue({ id: 1, nomeModulo: 'Atualizado' } as any);

    const result = await useCase.execute(1, { nomeModulo: 'Atualizado' });
    expect(result).toEqual({ id: 1, nomeModulo: 'Atualizado' });
    expect(moduloRepo.update).toHaveBeenCalledWith(1, { nomeModulo: 'Atualizado' });
  });
});
