import { GetAulaByIdUseCase } from './get-aula-by-id.use-case';
import { AulaRepository } from '../../../infrastructure/database/repositories/aula.repository';
import { NotFoundException } from '@nestjs/common';

describe('GetAulaByIdUseCase', () => {
  let useCase: GetAulaByIdUseCase;
  let aulaRepo: jest.Mocked<AulaRepository>;

  beforeEach(() => {
    aulaRepo = { findById: jest.fn() } as any;
    useCase = new GetAulaByIdUseCase(aulaRepo);
  });

  it('deve lançar exceção se a aula não existir', async () => {
    aulaRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });

  it('deve retornar aula se existir', async () => {
    aulaRepo.findById.mockResolvedValue({ id: 1, nomeAula: 'Teste' } as any);
    const result = await useCase.execute(1);
    expect(result).toEqual({ id: 1, nomeAula: 'Teste' });
  });
});
