import { Controller, Get, Param, ParseIntPipe, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { BuildDashboardUseCase } from 'src/application/use-cases/dashboard/build-dashboard.use-case';
import { DashboardResponseDto } from 'src/interfaces/http/dtos/responses/dashboard-response.dto';
import { AuthGuard } from 'src/interfaces/http/guards/auth.guard';

@Controller('usuarios')
export class DashboardController {
  constructor(private readonly buildDashboardUseCase: BuildDashboardUseCase) {}

  @UseGuards(AuthGuard)
  @Get(':id/dashboard')
  async getDashboard(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<DashboardResponseDto> {
    const usuarioIdDoToken = req.user.sub;
    if (id !== usuarioIdDoToken) {
      throw new UnauthorizedException('Você só pode acessar seu próprio dashboard.');
    }

    return this.buildDashboardUseCase.execute(usuarioIdDoToken);
  }
}
