import { Injectable } from '@nestjs/common';
import { DashboardResponseDto } from 'src/interfaces/http/dtos/responses/dashboard-response.dto';
import { DashboardRepository } from 'src/infrastructure/database/repositories/dashboard.repository';

@Injectable()
export class BuildDashboardUseCase {
  constructor(private readonly dashboardRepo: DashboardRepository) {}

  async execute(usuarioId: number): Promise<DashboardResponseDto> {
    return this.dashboardRepo.getDashboardData(usuarioId);
  }
}