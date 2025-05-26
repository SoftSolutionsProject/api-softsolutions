import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ModuloService } from '../../../application/modulo/use-cases/modulo.service';
import { CreateModuloDto } from '../../../application/modulo/dtos/create-modulo.dto';
import { UpdateModuloDto } from '../../../application/modulo/dtos/update-modulo.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../usuario/decorators/user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Módulos')
@ApiBearerAuth()
@Controller('modulos')
@UseGuards(AuthGuard)
export class UsuarioController {
  constructor(private readonly moduloService: ModuloService) { }

  @Post()
  @ApiOperation({ summary: 'Criar um novo módulo' })
  @ApiBody({ type: CreateModuloDto })
  @ApiResponse({ status: 201, description: 'Módulo criado com sucesso' })
  async create(@Body() dto: CreateModuloDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem criar módulos');
    return this.moduloService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os módulos' })
  @ApiResponse({ status: 200, description: 'Lista de módulos' })
  async findAll() {
    return this.moduloService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um módulo pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Módulo encontrado' })
  async findOne(@Param('id') id: number) {
    return this.moduloService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um módulo pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateModuloDto })
  @ApiResponse({ status: 200, description: 'Módulo atualizado com sucesso' })
  async update(@Param('id') id: number, @Body() dto: UpdateModuloDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem atualizar módulos');
    return this.moduloService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um módulo pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Módulo removido com sucesso' })
  async remove(@Param('id') id: number, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem remover módulos');
    return this.moduloService.remove(id);
  }
}
