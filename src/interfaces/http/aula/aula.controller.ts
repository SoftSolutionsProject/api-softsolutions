import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AulaService } from '../../../application/aula/use-cases/aula.service';
import { CreateAulaDto } from '../../../application/aula/dtos/create-aula.dto';
import { UpdateAulaDto } from '../../../application/aula/dtos/update-aula.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../usuario/decorators/user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Aulas')
@ApiBearerAuth()
@Controller('aulas')
@UseGuards(AuthGuard)
export class AulaController {
  constructor(private readonly aulaService: AulaService) { }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova aula' })
  @ApiBody({ type: CreateAulaDto })
  @ApiResponse({ status: 201, description: 'Aula criada com sucesso' })
  async create(@Body() dto: CreateAulaDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem criar aulas');
    return this.aulaService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as aulas' })
  @ApiResponse({ status: 200, description: 'Lista de aulas' })
  async findAll() {
    return this.aulaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma aula pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Aula encontrada' })
  async findOne(@Param('id') id: number) {
    return this.aulaService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma aula pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateAulaDto })
  @ApiResponse({ status: 200, description: 'Aula atualizada com sucesso' })
  async update(@Param('id') id: number, @Body() dto: UpdateAulaDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem atualizar aulas');
    return this.aulaService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma aula pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Aula removida com sucesso' })
  async remove(@Param('id') id: number, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem remover aulas');
    return this.aulaService.remove(id);
  }

  @Get('modulo/:idModulo')
  @ApiOperation({ summary: 'Listar aulas por módulo' })
  @ApiParam({ name: 'idModulo', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de aulas do módulo' })
  async listarPorModulo(@Param('idModulo') idModulo: number) {
    return this.aulaService.findByModulo(idModulo);
  }

  @Get('curso/:idCurso')
  @ApiOperation({ summary: 'Listar aulas por curso' })
  @ApiParam({ name: 'idCurso', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de aulas do curso' })
  async listarPorCurso(@Param('idCurso') idCurso: number) {
    return this.aulaService.findByCurso(idCurso);
  }
}