import { Controller, Post, Patch, Body, Param, UseGuards, Get } from '@nestjs/common';
import { CriarAvaliacaoUseCase } from 'src/application/use-cases/avaliacao/criar-avaliacao.use-case';
import { AtualizarAvaliacaoUseCase } from 'src/application/use-cases/avaliacao/atualizar-avaliacao.use-case';
import { CreateAvaliacaoDto } from '../dtos/requests/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from '../dtos/requests/update-avaliacao.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { AvaliacaoRepository } from 'src/infrastructure/database/repositories/avaliacao.repository';

@Controller('avaliacoes')
export class AvaliacaoController {
  constructor(
    private readonly criarAvaliacaoUseCase: CriarAvaliacaoUseCase,
    private readonly atualizarAvaliacaoUseCase: AtualizarAvaliacaoUseCase,
    private readonly avaliacaoRepo: AvaliacaoRepository,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async criar(
    @User('sub') userId: number,
    @Body() dto: CreateAvaliacaoDto,
  ) {
    return this.criarAvaliacaoUseCase.execute(userId, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async atualizar(
    @User('sub') userId: number,
    @Param('id') id: number,
    @Body() dto: UpdateAvaliacaoDto,
  ) {
    return this.atualizarAvaliacaoUseCase.execute(userId, +id, dto);
  }

  @Get('curso/:cursoId')
  async listarAvaliacoesPorCurso(@Param('cursoId') cursoId: number) {
    const avaliacoes = await this.avaliacaoRepo.findByCourse(+cursoId);
    return avaliacoes.map(a => ({
      nota: a.nota,
      comentario: a.comentario,
      autor: a.usuario?.nomeUsuario ?? null,
    }));
  }

  @Get('curso/:cursoId/minha')
  @UseGuards(AuthGuard)
  async getMinhaAvaliacao(
    @User('sub') userId: number,
    @Param('cursoId') cursoId: number
  ) {
    return this.avaliacaoRepo.findByUserAndCourse(userId, +cursoId);
  }
}
