import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { InscricaoService } from '../../../application/inscricao/use-cases/inscricao.service';
import { CreateInscricaoDto } from '../../../application/inscricao/dtos/create-inscricao.dto';
import { User } from '../usuario/decorators/user.decorator';

@Controller('inscricoes')
@UseGuards(AuthGuard)
export class InscricaoController {
  constructor(private readonly service: InscricaoService) {}

  @Post()
  async inscrever(@Body() dto: CreateInscricaoDto, @User() user: any) {
    if (dto.idUser !== user.sub) throw new ForbiddenException('Acesso negado');
    return this.service.inscrever(dto);
  }

  @Get(':idUser')
  async listar(@Param('idUser') id: number, @User() user: any) {
    if (id !== user.sub) throw new ForbiddenException('Acesso negado');
    return this.service.listarPorUsuario(id);
  }

  @Delete(':idUser/cursos/:idModulo')
  async cancelar(@Param('idUser') id: number, @Param('idModulo') idModulo: number, @User() user: any) {
    if (id !== user.sub) throw new ForbiddenException('Acesso negado');
    return this.service.cancelar(id, idModulo);
  }
}