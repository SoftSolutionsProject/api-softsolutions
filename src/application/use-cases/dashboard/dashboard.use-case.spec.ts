import { BuildDashboardUseCase } from './build-dashboard.use-case';

describe('BuildDashboardUseCase', () => {
  it('deve delegar a busca ao repositório', async () => {
    const dashboard = {
      progresso: 80,
      certificados: 2,
      cursosEmAndamento: [],
      cursosConcluidos: [],
      cursosRecomendados: [],
    };
    const repo = {
      getDashboardData: jest.fn().mockResolvedValue(dashboard),
    } as any;
    const useCase = new BuildDashboardUseCase(repo);

    await expect(useCase.execute(15)).resolves.toEqual(dashboard);
    expect(repo.getDashboardData).toHaveBeenCalledWith(15);
  });
});
