// ver-progresso.use-case.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { VerProgressoUseCase } from './ver-progresso.use-case';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { ProgressoAulaRepository } from '../../../infrastructure/database/repositories/progresso-aula.repository';
import { NotFoundException } from '@nestjs/common';

describe('VerProgressoUseCase', () => {
  let useCase: VerProgressoUseCase;
  let inscricaoRepo: jest.Mocked<InscricaoRepository>;
  let progressoRepo: jest.Mocked<ProgressoAulaRepository>;

  beforeEach(async () => {
    inscricaoRepo = {
      findById: jest.fn(),
    } as any;

    progressoRepo = {
      countConcluidasByInscricao: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerProgressoUseCase,
        { provide: InscricaoRepository, useValue: inscricaoRepo },
        { provide: ProgressoAulaRepository, useValue: progressoRepo },
      ],
    }).compile();

    useCase = module.get<VerProgressoUseCase>(VerProgressoUseCase);
  });

  it('deve retornar o progresso corretamente', async () => {
    const inscricaoMock = {
      id: 1,
      usuario: { id: 1 },
      curso: {
        modulos: [
          { aulas: [{}, {}, {}] },
          { aulas: [{}, {}] },
        ],
      },
    };

    inscricaoRepo.findById.mockResolvedValue(inscricaoMock as any);
    progressoRepo.countConcluidasByInscricao.mockResolvedValue(3);

    const result = await useCase.execute(1, 1);

    expect(inscricaoRepo.findById).toHaveBeenCalledWith(1);
    expect(progressoRepo.countConcluidasByInscricao).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      progresso: 60, // 3 de 5 aulas concluídas
      aulasConcluidas: 3,
      totalAulas: 5,
    });
  });

  it('deve lançar erro se inscrição não existir ou não pertencer', async () => {
    inscricaoRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1, 1)).rejects.toThrow(NotFoundException);
  });
});
