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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { CreateModuloUseCase } from '../../../application/use-cases/modulo/create-modulo.use-case';
import { DeleteModuloUseCase } from '../../../application/use-cases/modulo/delete-modulo.use-case';
import { GetModuloByIdUseCase } from '../../../application/use-cases/modulo/get-modulo-by-id.use-case';
import { ListModuloUseCase } from '../../../application/use-cases/modulo/list-modulo.use-case';
import { UpdateModuloUseCase } from '../../../application/use-cases/modulo/update-modulo.use-case';
import { CreateModuloDto } from '../dtos/requests/create-modulo.dto';
import { UpdateModuloDto } from '../dtos/requests/update-modulo.dto';

@ApiTags('Modulos')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('modulos')
export class ModuloController {
  constructor(
    private readonly createModulo: CreateModuloUseCase,
    private readonly getModuloById: GetModuloByIdUseCase,
    private readonly listModulo: ListModuloUseCase,
    private readonly updateModulo: UpdateModuloUseCase,
    private readonly deleteModulo: DeleteModuloUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo módulo (apenas administrador)' })
  @ApiResponse({ status: 201, description: 'Módulo criado com sucesso' })
  async create(@Body() dto: CreateModuloDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem criar módulos');
    return this.createModulo.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os módulos' })
  @ApiResponse({ status: 200, description: 'Lista de módulos' })
  async findAll() {
    return this.listModulo.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar módulo por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Módulo encontrado' })
  async findOne(@Param('id') id: string) {
    return this.getModuloById.execute(parseInt(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar módulo (apenas administrador)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Módulo atualizado com sucesso' })
  async update(@Param('id') id: string, @Body() dto: UpdateModuloDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem atualizar módulos');
    return this.updateModulo.execute(parseInt(id), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover módulo (apenas administrador)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Módulo removido com sucesso' })
  async remove(@Param('id') id: string, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem remover módulos');
    return this.deleteModulo.execute(parseInt(id));
  }
}
