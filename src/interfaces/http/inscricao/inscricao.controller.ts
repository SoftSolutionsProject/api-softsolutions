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

@Controller('inscricoes')
@UseGuards(AuthGuard)
export class InscricaoController {
  constructor(private readonly service: InscricaoService) {}

  @Post('cursos/:idCurso')
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
  async listarInscricoes(@User('id') idUsuario: number) {
    return this.service.listarInscricoesUsuario(idUsuario);
  }
 
@Get(':idInscricao/progresso')
async verProgresso(
  @Param('idInscricao') idInscricao: number,
  @User('id') idUsuario: number
) {
  return this.service.getProgressoValidado(idInscricao, idUsuario);
}

  @Delete(':idInscricao/cancelar')
  async cancelarInscricao(
    @Param('idInscricao') idInscricao: number,
    @User('id') idUsuario: number
  ) {
    return this.service.cancelarInscricao(idUsuario, idInscricao);
  }

  @Post(':idInscricao/concluir-aula/:idAula')
async marcarAulaConcluida(
  @Param('idInscricao') idInscricao: number,
  @Param('idAula') idAula: number,
  @User('id') idUsuario: number
) {
  return this.service.marcarAulaConcluida(idInscricao, idAula, idUsuario);
}

}