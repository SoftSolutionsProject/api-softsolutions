import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Param, 
  UseGuards,
  NotFoundException,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { InscreverUsuarioUseCase } from '../../../application/use-cases/inscricao/inscrever-usuario.use-case';
import { ListarInscricoesUseCase } from '../../../application/use-cases/inscricao/listar-inscricoes.use-case';
import { MarcarAulaConcluidaUseCase } from '../../../application/use-cases/inscricao/marcar-aula-concluida.use-case';
import { CancelarInscricaoUseCase } from '../../../application/use-cases/inscricao/cancelar-inscricao.use-case';
import { VerProgressoUseCase } from '../../../application/use-cases/inscricao/ver-progresso.use-case';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { DesmarcarAulaConcluidaUseCase } from '../../../application/use-cases/inscricao/desmarcar-aula-concluida.use-case';

@ApiTags('Inscricoes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('inscricoes')
export class InscricaoController {
  constructor(
    private readonly inscreverUsuarioUseCase: InscreverUsuarioUseCase,
    private readonly listarInscricoesUseCase: ListarInscricoesUseCase,
    private readonly marcarAulaConcluidaUseCase: MarcarAulaConcluidaUseCase,
    private readonly cancelarInscricaoUseCase: CancelarInscricaoUseCase,
    private readonly verProgressoUseCase: VerProgressoUseCase,
    private readonly inscricaoRepo: InscricaoRepository,
    private readonly cursoRepo: CursoRepository,
    private readonly desmarcarAulaConcluidaUseCase: DesmarcarAulaConcluidaUseCase
  ) {}

  @Post('cursos/:idCurso')
  @ApiOperation({ summary: 'Inscrever usuário em um curso' })
  @ApiParam({ name: 'idCurso', type: Number })
  @ApiResponse({ status: 201, description: 'Inscrição realizada com sucesso' })
  async inscrever(
    @Param('idCurso') idCurso: number,
    @User('sub') idUsuario: number
  ) {
    try {
      return await this.inscreverUsuarioUseCase.execute(idUsuario, idCurso);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get('usuario')
  @ApiOperation({ summary: 'Listar todas as inscrições do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de inscrições do usuário' })
  async listar(@User('sub') idUsuario: number) {
    return this.listarInscricoesUseCase.execute(idUsuario);
  }

  @Get(':idInscricao/progresso')
  @ApiOperation({ summary: 'Ver progresso do curso na inscrição' })
  @ApiParam({ name: 'idInscricao', type: Number })
  @ApiResponse({ status: 200, description: 'Progresso retornado com sucesso' })
  async progresso(
    @Param('idInscricao') idInscricao: number,
    @User('sub') idUsuario: number
  ) {
    return this.verProgressoUseCase.execute(idInscricao, idUsuario);
  }

  @Delete(':idInscricao/cancelar')
  @ApiOperation({ summary: 'Cancelar inscrição no curso' })
  @ApiParam({ name: 'idInscricao', type: Number })
  @ApiResponse({ status: 200, description: 'Inscrição cancelada com sucesso' })
  async cancelar(
    @Param('idInscricao') idInscricao: number,
    @User('sub') idUsuario: number,
    @User('tipo') tipo: string
  ) {
    const isAdmin = tipo === 'administrador';
    return this.cancelarInscricaoUseCase.execute(
      isAdmin ? idInscricao : idUsuario, 
      idInscricao,
      isAdmin
    );
  }

  @Post(':idInscricao/concluir-aula/:idAula')
  @ApiOperation({ summary: 'Marcar aula como concluída' })
  @ApiParam({ name: 'idInscricao', type: Number })
  @ApiParam({ name: 'idAula', type: Number })
  @ApiResponse({ status: 200, description: 'Aula marcada como concluída' })
  async concluirAula(
    @Param('idInscricao') idInscricao: number,
    @Param('idAula') idAula: number,
    @User('sub') idUsuario: number
  ) {
    return this.marcarAulaConcluidaUseCase.execute(idInscricao, idAula, idUsuario);
  }

  @Post(':idInscricao/desmarcar-aula/:idAula')
  @ApiOperation({ summary: 'Desmarcar aula como concluída' })
  @ApiParam({ name: 'idInscricao', type: Number })
  @ApiParam({ name: 'idAula', type: Number })
  @ApiResponse({ status: 200, description: 'Aula desmarcada com sucesso' })
  async desmarcarAula(
    @Param('idInscricao') idInscricao: number,
    @Param('idAula') idAula: number,
    @User('sub') idUsuario: number
  ) {
    return this.desmarcarAulaConcluidaUseCase.execute(idInscricao, idAula, idUsuario);
  }

  @Get(':id/aulas')
  @ApiOperation({ summary: 'Listar módulos e aulas do curso inscrito' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de módulos e aulas do curso' })
  async getModulosEAulas(
    @Param('id') id: string,
    @User('sub') idUsuario: number,
  ) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) throw new ForbiddenException('ID inválido');

    const curso = await this.cursoRepo.findByIdWithModulosAndAulas(idNumber);
    if (!curso) throw new NotFoundException('Curso não encontrado');

    const inscricao = await this.inscricaoRepo.findByUsuarioAndCurso(idUsuario, idNumber);
    if (!inscricao || inscricao.status !== 'ativo') {
      throw new ForbiddenException('Você não está inscrito neste curso');
    }

    return curso.modulos;
  }
}
