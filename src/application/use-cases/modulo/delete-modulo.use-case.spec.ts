import { DeleteModuloUseCase } from './delete-modulo.use-case';
import { ModuloRepository } from '../../../infrastructure/database/repositories/modulo.repository';
import { NotFoundException } from '@nestjs/common';

describe('DeleteModuloUseCase', () => {
  let useCase: DeleteModuloUseCase;
  let moduloRepo: jest.Mocked<ModuloRepository>;

  beforeEach(() => {
    moduloRepo = { findById: jest.fn(), delete: jest.fn() } as any;
    useCase = new DeleteModuloUseCase(moduloRepo);
  });

  it('deve lançar exceção se módulo não existir', async () => {
    moduloRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });

  it('deve deletar módulo se existir', async () => {
    moduloRepo.findById.mockResolvedValue({ id: 1 } as any);
    moduloRepo.delete.mockResolvedValue();

    const result = await useCase.execute(1);
    expect(result).toEqual({ message: 'Módulo removido com sucesso' });
    expect(moduloRepo.delete).toHaveBeenCalledWith(1);
  });
});
