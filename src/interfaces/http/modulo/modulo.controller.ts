import { Controller, UseGuards } from '@nestjs/common';
import { ModuloService } from '../../../application/modulo/use-cases/modulo.service';
import { AuthGuard } from '../guards/auth.guard';
import { Post, Body } from '@nestjs/common';
import { CreateModuloDto } from '../../../application/modulo/dtos/create-modulo.dto';
import { User } from '../usuario/decorators/user.decorator';

@Controller('modulos')
@UseGuards(AuthGuard)
export class ModuloController {
    constructor(private readonly moduloService: ModuloService) { }

@Post()
async create(@Body() dto: CreateModuloDto, @User('tipo') tipo: string) {
    if (tipo !== 'administrador') throw new Error('Apenas administradores podem criar módulos');
    return this.moduloService.create(dto);
}
}
