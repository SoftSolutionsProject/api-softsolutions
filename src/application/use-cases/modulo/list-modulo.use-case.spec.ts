import { ListModuloUseCase } from './list-modulo.use-case';
import { ModuloRepository } from '../../../infrastructure/database/repositories/modulo.repository';

describe('ListModuloUseCase', () => {
  let useCase: ListModuloUseCase;
  let moduloRepo: jest.Mocked<ModuloRepository>;

  beforeEach(() => {
    moduloRepo = { findAll: jest.fn() } as any;
    useCase = new ListModuloUseCase(moduloRepo);
  });

  it('deve retornar todos os módulos', async () => {
    const modulosMock = [{ id: 1, nomeModulo: 'Módulo 1' }];
    moduloRepo.findAll.mockResolvedValue(modulosMock as any);

    const result = await useCase.execute();
    expect(result).toEqual(modulosMock);
  });
});
