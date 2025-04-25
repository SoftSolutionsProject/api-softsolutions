import { Controller, Get, Post, Delete, Param, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { InscricaoService } from '../../../application/inscricao/use-cases/inscricao.service';
import { CreateInscricaoDto } from '../../../application/inscricao/dtos/create-inscricao.dto';
import { User } from '../usuario/decorators/user.decorator';

@Controller('inscricoes')
@UseGuards(AuthGuard)
export class InscricaoController {
  constructor(private readonly service: InscricaoService) {}

  @Post()
  async inscrever(@Body() dto: CreateInscricaoDto, @User('sub') userId: number) {
    if (dto.idUser !== userId) throw new ForbiddenException('Acesso negado');
    return this.service.inscrever(dto);
  }

  @Get(':idUser')
async listar(@Param('idUser') id: string, @User('sub') userId: number) {
  const idNumber = Number(id);
  if (idNumber !== userId) throw new ForbiddenException('Acesso negado');
  return this.service.listarPorUsuario(idNumber);
}

@Delete(':idUser/cursos/:idModulo')
async cancelar(
  @Param('idUser') id: string,
  @Param('idModulo') idModulo: string,
  @User('sub') userId: number,
) {
  const idNum = Number(id);
  const idModuloNum = Number(idModulo);

  if (idNum !== userId) throw new ForbiddenException('Acesso negado');
  return this.service.cancelar(idNum, idModuloNum);
}

}
