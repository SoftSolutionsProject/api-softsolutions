import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsuarioService } from '../../../application/usuario/use-cases/usuario.service';
import { CreateUsuarioDto } from '../../../application/usuario/dtos/create-usuario.dto';
import { LoginUsuarioDto } from '../../../application/usuario/dtos/login-usuario.dto';
import { Usuario } from '../../../domain/usuario/usuario.entity';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './decorators/user.decorator';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('cadastro')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.create(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginUsuarioDto) {
    return this.usuarioService.login(data.email, data.senha);
  }

  @UseGuards(AuthGuard)
@Get(':id')
async findOne(
  @Param('id') id: string,
  @User('id') userId: number,  // Mude de 'sub' para 'id'
  @User('tipo') tipo: string
): Promise<Usuario> {
  const idNumber = parseInt(id, 10);
  if (isNaN(idNumber)) {
    throw new BadRequestException('ID inválido');
  }

  if (idNumber !== userId && tipo !== 'administrador') {
    throw new ForbiddenException('Acesso negado');
  }
  
  return this.usuarioService.findById(idNumber);
}

@UseGuards(AuthGuard)
@Put(':id')
async update(
  @Param('id') id: string,
  @Body() dto: Partial<CreateUsuarioDto>,
  @User('id') userId: number,  // Certifique-se de usar 'id' aqui também
  @User('tipo') tipo: string
): Promise<Usuario> {
  const idNumber = parseInt(id, 10);
  if (isNaN(idNumber)) {
    throw new BadRequestException('ID inválido');
  }

  // Verificação de permissão
  if (idNumber !== userId && tipo !== 'administrador') {
    throw new ForbiddenException('Acesso negado');
  }

  // Bloqueia alteração de tipo se não for administrador
  if (dto.tipo && tipo !== 'administrador') {
    delete dto.tipo;
  }

  return this.usuarioService.update(idNumber, dto);
}

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string, // Mudamos para string
    @User('sub') userId: number,
    @User('tipo') tipo: string
  ): Promise<{ message: string }> {
    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      throw new ForbiddenException('ID inválido');
    }

    if (tipo !== 'administrador' && idNumber !== userId) {
      throw new ForbiddenException('Acesso negado');
    }
    return this.usuarioService.remove(idNumber);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@User('tipo') tipo: string): Promise<Usuario[]> {
    if (tipo !== 'administrador') {
      throw new ForbiddenException('Apenas administradores podem listar usuários');
    }
    return this.usuarioService.findAll();
  }


}