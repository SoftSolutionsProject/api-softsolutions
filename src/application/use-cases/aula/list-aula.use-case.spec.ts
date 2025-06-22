import { ListAulaUseCase } from './list-aula.use-case';
import { AulaRepository } from '../../../infrastructure/database/repositories/aula.repository';

describe('ListAulaUseCase', () => {
  let useCase: ListAulaUseCase;
  let aulaRepo: jest.Mocked<AulaRepository>;

  beforeEach(() => {
    aulaRepo = {
      findAll: jest.fn(),
    } as any;

    useCase = new ListAulaUseCase(aulaRepo);
  });

  it('deve retornar todas as aulas', async () => {
    aulaRepo.findAll.mockResolvedValue([
      { id: 1, nomeAula: 'Aula 1' },
      { id: 2, nomeAula: 'Aula 2' },
    ] as any);

    const result = await useCase.execute();

    expect(result).toEqual([
      { id: 1, nomeAula: 'Aula 1' },
      { id: 2, nomeAula: 'Aula 2' },
    ]);

    expect(aulaRepo.findAll).toHaveBeenCalledTimes(1);
  });
});
