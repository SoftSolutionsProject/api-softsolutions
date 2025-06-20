import { DeleteAulaUseCase } from './delete-aula.use-case';
import { AulaRepository } from '../../../infrastructure/database/repositories/aula.repository';
import { NotFoundException } from '@nestjs/common';

describe('DeleteAulaUseCase', () => {
  let useCase: DeleteAulaUseCase;
  let aulaRepo: jest.Mocked<AulaRepository>;

  beforeEach(() => {
    aulaRepo = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;

    useCase = new DeleteAulaUseCase(aulaRepo);
  });

  it('deve lançar exceção se a aula não existir', async () => {
    aulaRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });

  it('deve deletar aula se existir', async () => {
    aulaRepo.findById.mockResolvedValue({ id: 1 } as any);

    const result = await useCase.execute(1);

    expect(aulaRepo.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: 'Aula removida com sucesso' });
  });
});
