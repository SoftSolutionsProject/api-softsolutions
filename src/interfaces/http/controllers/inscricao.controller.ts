import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Param, 
  Body, 
  UseGuards,
  NotFoundException,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
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

@Controller('inscricoes')
@UseGuards(AuthGuard)
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
  async listar(@User('sub') idUsuario: number) {
    return this.listarInscricoesUseCase.execute(idUsuario);
  }

  @Get(':idInscricao/progresso')
  async progresso(
    @Param('idInscricao') idInscricao: number,
    @User('sub') idUsuario: number
  ) {
    return this.verProgressoUseCase.execute(idInscricao, idUsuario);
  }

  @Delete(':idInscricao/cancelar')
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
  async concluirAula(
    @Param('idInscricao') idInscricao: number,
    @Param('idAula') idAula: number,
    @User('sub') idUsuario: number
  ) {
    return this.marcarAulaConcluidaUseCase.execute(idInscricao, idAula, idUsuario);
  }

   @Post(':idInscricao/desmarcar-aula/:idAula')
  async desmarcarAula(
    @Param('idInscricao') idInscricao: number,
    @Param('idAula') idAula: number,
    @User('sub') idUsuario: number
  ) {
    return this.desmarcarAulaConcluidaUseCase.execute(idInscricao, idAula, idUsuario);
  }


@UseGuards(AuthGuard)
@Get(':id/aulas')
async getModulosEAulas(
  @Param('id') id: string,
  @User('sub') idUsuario: number, // Pegamos o id do usuário do token
) {
  const idNumber = parseInt(id);
  if (isNaN(idNumber)) throw new ForbiddenException('ID inválido');

  // Verifica se o curso existe
  const curso = await this.cursoRepo.findByIdWithModulosAndAulas(idNumber);
  if (!curso) throw new NotFoundException('Curso não encontrado');

  // Verifica se o usuário está inscrito no curso
  const inscricao = await this.inscricaoRepo.findByUsuarioAndCurso(idUsuario, idNumber);
  if (!inscricao || inscricao.status !== 'ativo') {
    throw new ForbiddenException('Você não está inscrito neste curso');
  }

  return curso.modulos;

  
}

}
