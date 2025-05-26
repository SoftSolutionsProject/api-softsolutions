import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CursoService } from '../../../application/curso/use-cases/curso.service';
import { CreateCursoDto } from '../../../application/curso/dtos/create-curso.dto';
import { UpdateCursoDto } from '../../../application/curso/dtos/update-curso.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../usuario/decorators/user.decorator';
import { ForbiddenException } from '@nestjs/common';
import { AulaService } from 'src/application/aula/use-cases/aula.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Cursos')
@ApiBearerAuth()
@Controller('cursos')
export class CursoController {
  constructor(
    private readonly cursoService: CursoService,
    private readonly aulaService: AulaService,
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar um novo curso' })
  @ApiBody({ type: CreateCursoDto })
  @ApiResponse({ status: 201, description: 'Curso criado com sucesso' })
  async create(@Body() dto: CreateCursoDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new ForbiddenException('Apenas administradores podem criar cursos');
    return this.cursoService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os cursos' })
  @ApiResponse({ status: 200, description: 'Lista de cursos' })
  async findAll() {
    return this.cursoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um curso pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Curso encontrado' })
  async findOne(@Param('id') id: number) {
    return this.cursoService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um curso pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCursoDto })
  @ApiResponse({ status: 200, description: 'Curso atualizado com sucesso' })
  async update(@Param('id') id: number, @Body() dto: UpdateCursoDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new ForbiddenException('Apenas administradores podem atualizar cursos');
    return this.cursoService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um curso pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Curso removido com sucesso' })
  async remove(@Param('id') id: number, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new ForbiddenException('Apenas administradores podem remover cursos');
    return this.cursoService.remove(id);
  }

  @Get(':id/aulas')
  @ApiOperation({ summary: 'Listar aulas de um curso' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de aulas do curso' })
  async listarAulasDoCurso(@Param('id') idCurso: number) {
    return this.aulaService.findByCurso(idCurso);
  }
}