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
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { CreateAulaUseCase } from 'src/application/use-cases/aula/create-aula.use-case';
import { DeleteAulaUseCase } from 'src/application/use-cases/aula/delete-aula.use-case';
import { GetAulaByIdUseCase } from 'src/application/use-cases/aula/get-aula-by-id.use-case';
import { ListAulaUseCase } from 'src/application/use-cases/aula/list-aula.use-case';
import { UpdateAulaUseCase } from 'src/application/use-cases/aula/update-aula.use-case';
import { ListAulaByModuloUseCase } from 'src/application/use-cases/aula/list-aula-by-modulo.use-case';
import { ListAulaByCursoUseCase } from 'src/application/use-cases/aula/list-aula-by-curso.use-case';
import { CreateAulaDto } from '../dtos/requests/create-aula.dto';
import { UpdateAulaDto } from '../dtos/requests/update-aula.dto';
import { AulaResponseDto } from '../dtos/responses/aula.response.dto';
import { ForbiddenException } from '@nestjs/common';

@Controller('aulas')
export class AulaController {
  constructor(
    private readonly createAula: CreateAulaUseCase,
    private readonly deleteAula: DeleteAulaUseCase,
    private readonly getAulaById: GetAulaByIdUseCase,
    private readonly listAula: ListAulaUseCase,
    private readonly updateAula: UpdateAulaUseCase,
    private readonly listAulaByModulo: ListAulaByModuloUseCase,
    private readonly listAulaByCurso: ListAulaByCursoUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createDto: CreateAulaDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new ForbiddenException('Apenas administradores podem criar aulas');
    const aula = await this.createAula.execute(createDto);
    return new AulaResponseDto(aula);
  }

  @Get()
  async list() {
    const aulas = await this.listAula.execute();
    return aulas.map(aula => new AulaResponseDto(aula));
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const aula = await this.getAulaById.execute(parseInt(id));
    return new AulaResponseDto(aula);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAulaDto,
    @User('tipo') tipo: string,
  ) {
    if (tipo !== 'administrador') throw new ForbiddenException('Apenas administradores podem atualizar aulas');
    const aula = await this.updateAula.execute(parseInt(id), updateDto);
    return new AulaResponseDto(aula);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new ForbiddenException('Apenas administradores podem remover aulas');
    return this.deleteAula.execute(parseInt(id));
  }

  @Get('modulo/:idModulo')
  async listByModulo(@Param('idModulo') idModulo: string) {
    const aulas = await this.listAulaByModulo.execute(parseInt(idModulo));
    return aulas.map(aula => new AulaResponseDto(aula));
  }

  @Get('curso/:idCurso')
  async listByCurso(@Param('idCurso') idCurso: string) {
    const aulas = await this.listAulaByCurso.execute(parseInt(idCurso));
    return aulas.map(aula => new AulaResponseDto(aula));
  }
}