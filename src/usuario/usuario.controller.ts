import { Controller, Post, Body, Get, Param, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { Usuario } from './usuario.entity';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('cadastro')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.create(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Usuario> {
    return this.usuarioService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: Partial<CreateUsuarioDto>): Promise<Usuario> {
    return this.usuarioService.update(id, dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginUsuarioDto) {
    return this.usuarioService.login(data.email, data.senha);
  }
}
