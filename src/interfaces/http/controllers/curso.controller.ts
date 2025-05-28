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
} from '@nestjs/common';
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

@Controller('cursos')
export class CursoController {
  constructor(
    private readonly createCurso: CreateCursoUseCase,
    private readonly getCursoById: GetCursoByIdUseCase,
    private readonly listCurso: ListCursoUseCase,
    private readonly updateCurso: UpdateCursoUseCase,
    private readonly deleteCurso: DeleteCursoUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCursoDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador')
      throw new ForbiddenException('Apenas administradores podem criar cursos');
    const curso = await this.createCurso.execute(dto);
    return new CursoResponseDto(curso);
  }

  @Get()
  async list() {
    const cursos = await this.listCurso.execute();
    return cursos.map((c) => new CursoResponseDto(c));
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) throw new ForbiddenException('ID inválido');
    const curso = await this.getCursoById.execute(idNumber);
    return new CursoResponseDto(curso);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
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
  @Delete(':id')
  async delete(@Param('id') id: string, @User('tipo') tipo: string) {
    if (tipo !== 'administrador')
      throw new ForbiddenException('Apenas administradores podem remover cursos');
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) throw new ForbiddenException('ID inválido');
    return this.deleteCurso.execute(idNumber);
  }
}