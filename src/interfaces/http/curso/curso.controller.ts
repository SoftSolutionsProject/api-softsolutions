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
  
  @Controller('cursos')
  export class CursoController {
    constructor(private readonly cursoService: CursoService, private readonly aulaService: AulaService) {}
  
    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() dto: CreateCursoDto, @User('tipo') tipo: string) {
      if (tipo !== 'administrador') throw new ForbiddenException('Apenas administradores podem criar cursos');
      return this.cursoService.create(dto);
    }
  
    @Get()
    async findAll() {
      return this.cursoService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: number) {
      return this.cursoService.findOne(id);
    }
  
    @UseGuards(AuthGuard)
    @Put(':id')
    async update(@Param('id') id: number, @Body() dto: UpdateCursoDto, @User('tipo') tipo: string) {
      if (tipo !== 'administrador') throw new ForbiddenException('Apenas administradores podem atualizar cursos');
      return this.cursoService.update(id, dto);
    }
  
    @UseGuards(AuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: number, @User('tipo') tipo: string) {
      if (tipo !== 'administrador') throw new ForbiddenException('Apenas administradores podem remover cursos');
      return this.cursoService.remove(id);
    }

@Get(':id/aulas')
async listarAulasDoCurso(@Param('id') idCurso: number) {
  return this.aulaService.findByCurso(idCurso);
}
  }