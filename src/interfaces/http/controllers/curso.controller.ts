import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { CreateCursoDto } from '../dtos/requests/create-curso.dto';
import { UpdateCursoDto } from '../dtos/requests/update-curso.dto';
import { CreateCursoUseCase } from '../../../application/use-cases/curso/create-curso.use-case';
import { DeleteCursoUseCase } from '../../../application/use-cases/curso/delete-curso.use-case';
import { GetCursoByIdUseCase } from '../../../application/use-cases/curso/get-curso-by-id.use-case';
import { ListCursoUseCase } from '../../../application/use-cases/curso/list-curso.use-case';
import { UpdateCursoUseCase } from '../../../application/use-cases/curso/update-curso.use-case';
import { CursoResponseDto } from '../dtos/responses/curso.response.dto';
import { CursoRepository } from 'src/infrastructure/database/repositories/curso.repository';
import { InscricaoRepository } from 'src/infrastructure/database/repositories/inscricao.repository';

@ApiTags('Cursos')
@Controller('cursos')
export class CursoController {
  constructor(
    private readonly createCurso: CreateCursoUseCase,
    private readonly getCursoById: GetCursoByIdUseCase,
    private readonly listCurso: ListCursoUseCase,
    private readonly updateCurso: UpdateCursoUseCase,
    private readonly deleteCurso: DeleteCursoUseCase,
    private readonly cursoRepo: CursoRepository,
    private readonly inscricaoRepo: InscricaoRepository,
  ) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo curso (apenas administrador)' })
  @ApiResponse({ status: 201, type: CursoResponseDto })
  async create(@Body() dto: CreateCursoDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador')
      throw new ForbiddenException('Apenas administradores podem criar cursos');
    const curso = await this.createCurso.execute(dto);
    return new CursoResponseDto(curso);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os cursos' })
  @ApiResponse({ status: 200, type: [CursoResponseDto] })
  async list() {
    const cursos = await this.listCurso.execute();
    return cursos.map((c) => new CursoResponseDto(c));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar curso por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: CursoResponseDto })
  async getById(@Param('id') id: string) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) throw new ForbiddenException('ID inválido');
    const curso = await this.getCursoById.execute(idNumber);
    return new CursoResponseDto(curso);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar curso (apenas administrador)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: CursoResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCursoDto,
    @User('tipo') tipo: string,
  ) {
    if (tipo !== 'administrador')
      throw new ForbiddenException('Apenas administradores podem atualizar cursos');
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) throw new ForbiddenException('ID inválido');
    const curso = await this.updateCurso.execute(idNumber, dto);
    return new CursoResponseDto(curso);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Remover curso (apenas administrador)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Curso removido com sucesso' })
  async delete(@Param('id') id: string, @User('tipo') tipo: string) {
    if (tipo !== 'administrador')
      throw new ForbiddenException('Apenas administradores podem remover cursos');
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) throw new ForbiddenException('ID inválido');
    return this.deleteCurso.execute(idNumber);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id/aulas')
  @ApiOperation({ summary: 'Obter módulos e aulas do curso (requer inscrição)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de módulos e aulas' })
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
