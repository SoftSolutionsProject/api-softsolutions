import { VerProgressoUseCase } from './ver-progresso.use-case';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { ProgressoAulaRepository } from '../../../infrastructure/database/repositories/progresso-aula.repository';
import { NotFoundException } from '@nestjs/common';

describe('VerProgressoUseCase', () => {
  let useCase: VerProgressoUseCase;
  let inscricaoRepo: jest.Mocked<InscricaoRepository>;
  let progressoRepo: jest.Mocked<ProgressoAulaRepository>;

  beforeEach(() => {
    inscricaoRepo = {
      findById: jest.fn(),
    } as any;

    progressoRepo = {
      countConcluidasByInscricao: jest.fn(),
    } as any;

    useCase = new VerProgressoUseCase(inscricaoRepo, progressoRepo);
  });

  it('deve retornar o progresso corretamente', async () => {
    inscricaoRepo.findById.mockResolvedValue({
      id: 1,
      usuario: { id: 1 },
      curso: {
        modulos: [{ aulas: [{}, {}, {}] }, { aulas: [{}, {}] }],
      },
    } as any);
    progressoRepo.countConcluidasByInscricao.mockResolvedValue(3);

    await expect(useCase.execute(1, 1)).resolves.toEqual({
      progresso: 60,
      aulasConcluidas: 3,
      totalAulas: 5,
    });
  });

  it('deve retornar progresso zero quando o curso não tiver módulos', async () => {
    inscricaoRepo.findById.mockResolvedValue({
      id: 1,
      usuario: { id: 1 },
      curso: {
        modulos: undefined,
      },
    } as any);
    progressoRepo.countConcluidasByInscricao.mockResolvedValue(0);

    await expect(useCase.execute(1, 1)).resolves.toEqual({
      progresso: 0,
      aulasConcluidas: 0,
      totalAulas: 0,
    });
  });

  it('deve tratar módulos sem aulas como zero no total', async () => {
    inscricaoRepo.findById.mockResolvedValue({
      id: 1,
      usuario: { id: 1 },
      curso: {
        modulos: [{ aulas: undefined }],
      },
    } as any);
    progressoRepo.countConcluidasByInscricao.mockResolvedValue(0);

    await expect(useCase.execute(1, 1)).resolves.toEqual({
      progresso: 0,
      aulasConcluidas: 0,
      totalAulas: 0,
    });
  });

  it('deve lançar erro se inscrição não existir', async () => {
    inscricaoRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('deve lançar erro se inscrição pertencer a outro usuário', async () => {
    inscricaoRepo.findById.mockResolvedValue({
      id: 1,
      usuario: { id: 999 },
      curso: { modulos: [] },
    } as any);

    await expect(useCase.execute(1, 1)).rejects.toThrow(
      'Inscrição não encontrada',
    );
  });
});
