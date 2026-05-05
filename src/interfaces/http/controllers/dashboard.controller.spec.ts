import { UnauthorizedException } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';

describe('DashboardController', () => {
  let controller: DashboardController;
  let buildDashboardUseCase: { execute: jest.Mock };

  beforeEach(() => {
    buildDashboardUseCase = { execute: jest.fn() };
    controller = new DashboardController(buildDashboardUseCase as any);
  });

  it('deve retornar dashboard quando o id for o mesmo do token', async () => {
    const dashboard = { totalCursosInscritos: 2 };
    buildDashboardUseCase.execute.mockResolvedValue(dashboard);

    await expect(
      controller.getDashboard(7, { user: { sub: 7 } }),
    ).resolves.toEqual(dashboard);
    expect(buildDashboardUseCase.execute).toHaveBeenCalledWith(7);
  });

  it('deve lançar Unauthorized quando o id for diferente do token', async () => {
    await expect(
      controller.getDashboard(7, { user: { sub: 9 } }),
    ).rejects.toThrow(UnauthorizedException);
    expect(buildDashboardUseCase.execute).not.toHaveBeenCalled();
  });
});
