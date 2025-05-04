import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AulaService } from '../../../application/aula/use-cases/aula.service';
import { CreateAulaDto } from '../../../application/aula/dtos/create-aula.dto';
import { UpdateAulaDto } from '../../../application/aula/dtos/update-aula.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../usuario/decorators/user.decorator';

@Controller('aulas')
@UseGuards(AuthGuard)
export class AulaController {
  constructor(private readonly aulaService: AulaService) {}

  @Post()
  async create(@Body() dto: CreateAulaDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem criar aulas');
    return this.aulaService.create(dto);
  }

  @Get()
  async findAll() {
    return this.aulaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.aulaService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateAulaDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem atualizar aulas');
    return this.aulaService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem remover aulas');
    return this.aulaService.remove(id);
  }

  @Get('modulo/:idModulo')
async listarPorModulo(@Param('idModulo') idModulo: number) {
  return this.aulaService.findByModulo(idModulo);
}

@Get('curso/:idCurso')
async listarPorCurso(@Param('idCurso') idCurso: number) {
  return this.aulaService.findByCurso(idCurso);
}
}