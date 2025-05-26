import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { InscricaoService } from '../../../application/inscricao/use-cases/inscricao.service';
import { User } from '../usuario/decorators/user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Inscrições')
@ApiBearerAuth()
@Controller('inscricoes')
@UseGuards(AuthGuard)
export class InscricaoController {
  constructor(private readonly service: InscricaoService) { }

  @Post('cursos/:idCurso')
  @ApiOperation({ summary: 'Inscrever usuário em um curso' })
  @ApiParam({ name: 'idCurso', type: Number })
  @ApiResponse({ status: 201, description: 'Usuário inscrito com sucesso' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado' })
  @ApiResponse({ status: 400, description: 'Erro ao inscrever usuário' })
  async inscrever(
    @Param('idCurso') idCurso: number,
    @User('id') idUsuario: number
  ) {
    try {
      return await this.service.inscrever(idUsuario, idCurso);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get('usuario')
  @ApiOperation({ summary: 'Listar inscrições do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de inscrições do usuário' })
  async listarInscricoes(@User('id') idUsuario: number) {
    return this.service.listarInscricoesUsuario(idUsuario);
  }

  @Get(':idInscricao/progresso')
  @ApiOperation({ summary: 'Ver progresso de uma inscrição' })
  @ApiParam({ name: 'idInscricao', type: Number })
  @ApiResponse({ status: 200, description: 'Progresso da inscrição' })
  async verProgresso(
    @Param('idInscricao') idInscricao: number,
    @User('id') idUsuario: number
  ) {
    return this.service.getProgressoValidado(idInscricao, idUsuario);
  }

  @Delete(':idInscricao/cancelar')
  @ApiOperation({ summary: 'Cancelar uma inscrição' })
  @ApiParam({ name: 'idInscricao', type: Number })
  @ApiResponse({ status: 200, description: 'Inscrição cancelada com sucesso' })
  async cancelarInscricao(
    @Param('idInscricao') idInscricao: number,
    @User('id') idUsuario: number
  ) {
    return this.service.cancelarInscricao(idUsuario, idInscricao);
  }

  @Post(':idInscricao/concluir-aula/:idAula')
  @ApiOperation({ summary: 'Marcar aula como concluída em uma inscrição' })
  @ApiParam({ name: 'idInscricao', type: Number })
  @ApiParam({ name: 'idAula', type: Number })
  @ApiResponse({ status: 201, description: 'Aula marcada como concluída' })
  async marcarAulaConcluida(
    @Param('idInscricao') idInscricao: number,
    @Param('idAula') idAula: number,
    @User('id') idUsuario: number
  ) {
    return this.service.marcarAulaConcluida(idInscricao, idAula, idUsuario);
  }
}