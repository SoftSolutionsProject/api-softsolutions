import { CreateAulaUseCase } from './create-aula.use-case';
import { AulaRepository } from '../../../infrastructure/database/repositories/aula.repository';
import { ModuloRepository } from '../../../infrastructure/database/repositories/modulo.repository';
import { NotFoundException } from '@nestjs/common';

describe('CreateAulaUseCase', () => {
  let useCase: CreateAulaUseCase;
  let aulaRepo: jest.Mocked<AulaRepository>;
  let moduloRepo: jest.Mocked<ModuloRepository>;

  beforeEach(() => {
    aulaRepo = { create: jest.fn() } as any;
    moduloRepo = { findById: jest.fn() } as any;

    useCase = new CreateAulaUseCase(aulaRepo, moduloRepo);
  });

  it('deve lançar exceção se o módulo não existir', async () => {
    moduloRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute({ idModulo: 1 } as any)).rejects.toThrow(NotFoundException);
  });

  it('deve criar aula se módulo existir', async () => {
    const moduloMock = { id: 1, nomeModulo: 'Modulo Teste' } as any;
    moduloRepo.findById.mockResolvedValue(moduloMock);

    aulaRepo.create.mockResolvedValue({
      id: 1,
      nomeAula: 'Teste',
      tempoAula: 60,
      videoUrl: 'http://url',
      descricaoConteudo: 'Descricao',
      materialApoio: [],
      modulo: moduloMock,
    });

    const result = await useCase.execute({
      idModulo: 1,
      nomeAula: 'Teste',
      tempoAula: 60,
      videoUrl: 'http://url',
      descricaoConteudo: 'Descricao',
    } as any);

    expect(result).toEqual({
      id: 1,
      nomeAula: 'Teste',
      tempoAula: 60,
      videoUrl: 'http://url',
      descricaoConteudo: 'Descricao',
      materialApoio: [],
      modulo: moduloMock,
    });
  });
});
