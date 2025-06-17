import { Controller, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { CriarAvaliacaoUseCase } from 'src/application/use-cases/avaliacao/criar-avaliacao.use-case';
import { AtualizarAvaliacaoUseCase } from 'src/application/use-cases/avaliacao/atualizar-avaliacao.use-case';
import { CreateAvaliacaoDto } from '../dtos/requests/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from '../dtos/requests/update-avaliacao.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';

@Controller('avaliacoes')
@UseGuards(AuthGuard)
export class AvaliacaoController {
  constructor(
    private readonly criarAvaliacaoUseCase: CriarAvaliacaoUseCase,
    private readonly atualizarAvaliacaoUseCase: AtualizarAvaliacaoUseCase,
  ) {}

  @Post()
  async criar(
    @User('sub') userId: number, // 🔑 PEGA O ID JÁ INJETADO
    @Body() dto: CreateAvaliacaoDto,
  ) {
    return this.criarAvaliacaoUseCase.execute(userId, dto);
  }

  @Patch(':id')
  async atualizar(
    @User('sub') userId: number,
    @Param('id') id: number,
    @Body() dto: UpdateAvaliacaoDto,
  ) {
    return this.atualizarAvaliacaoUseCase.execute(userId, +id, dto);
  }
}
