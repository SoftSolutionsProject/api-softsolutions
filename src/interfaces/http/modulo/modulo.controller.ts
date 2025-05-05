import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ModuloService } from '../../../application/modulo/use-cases/modulo.service';
import { CreateModuloDto } from '../../../application/modulo/dtos/create-modulo.dto';
import { UpdateModuloDto } from '../../../application/modulo/dtos/update-modulo.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../usuario/decorators/user.decorator';

@Controller('modulos')
@UseGuards(AuthGuard)
export class ModuloController {
  constructor(private readonly moduloService: ModuloService) {}

  @Post()
  async create(@Body() dto: CreateModuloDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem criar módulos');
    return this.moduloService.create(dto);
  }

  @Get()
  async findAll() {
    return this.moduloService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.moduloService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateModuloDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem atualizar módulos');
    return this.moduloService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem remover módulos');
    return this.moduloService.remove(id);
  }
}