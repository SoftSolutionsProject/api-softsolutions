import { UnauthorizedException } from '@nestjs/common';
import { BuildDashboardUseCase } from '../../../application/use-cases/dashboard/build-dashboard.use-case';
import { ChatbotController } from './chatbot.controller';
import { DashboardController } from './dashboard.controller';
import { EmailController } from './email.controller';
import { HealthController } from './health.controller';
import { SearchController } from './search.controller';

describe('Additional controllers and dashboard use case', () => {
  it('delega construcao do dashboard', async () => {
    const repo = {
      getDashboardData: jest
        .fn()
        .mockResolvedValue({ totalCursosInscritos: 1 }),
    };
    const useCase = new BuildDashboardUseCase(repo as any);
    await expect(useCase.execute(7)).resolves.toEqual({
      totalCursosInscritos: 1,
    });
    expect(repo.getDashboardData).toHaveBeenCalledWith(7);
  });

  it('protege dashboard de outro usuario', async () => {
    const execute = jest.fn().mockResolvedValue({ ok: true });
    const controller = new DashboardController({ execute } as any);
    await expect(
      controller.getDashboard(2, { user: { sub: 1 } }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(
      controller.getDashboard(1, { user: { sub: 1 } }),
    ).resolves.toEqual({ ok: true });
  });

  it('delega chatbot, email e health', async () => {
    const execute = jest.fn().mockResolvedValue({ ok: true });
    await expect(
      new ChatbotController({ execute } as any).chat({ message: 'oi' }),
    ).resolves.toEqual({ ok: true });
    await expect(
      new EmailController({ execute } as any).enviarEmail({} as any),
    ).resolves.toEqual({ ok: true });
    expect(new HealthController().check()).toEqual({ status: 'ok' });
  });

  it('executa todos endpoints de busca', async () => {
    const text = { execute: jest.fn().mockResolvedValue([{ id: '1' }]) };
    const voice = { execute: jest.fn().mockResolvedValue({ intent: 'x' }) };
    const service = {
      getSuggestions: jest.fn().mockResolvedValue(['Curso']),
      reindexCursosEAulas: jest
        .fn()
        .mockResolvedValue({ totalDocuments: 2, documentsWithEmbedding: 1 }),
    };
    const controller = new SearchController(
      text as any,
      voice as any,
      service as any,
    );
    expect(await controller.textSearch({ q: 'x' })).toEqual({
      results: [{ id: '1' }],
      total: 1,
      query: 'x',
    });
    expect(await controller.autocomplete('x')).toEqual({
      suggestions: ['Curso'],
    });
    expect(await controller.voiceSearch({ text: 'x' })).toEqual({
      intent: 'x',
    });
    expect(await controller.reindex()).toEqual({
      message: 'Reindexacao concluida com sucesso.',
      totalDocuments: 2,
      documentsWithEmbedding: 1,
    });
  });
});
