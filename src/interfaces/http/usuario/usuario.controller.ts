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
  } from '@nestjs/common';
  import { UsuarioService } from '../../../application/usuario/use-cases/usuario.service';
  import { CreateUsuarioDto } from '../../../application/usuario/dtos/create-usuario.dto';
  import { LoginUsuarioDto } from '../../../application/usuario/dtos/login-usuario.dto';
  import { Usuario } from '../../../domain/usuario/usuario.entity';
  import { AuthGuard } from '../guards/auth.guard';
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
    async findOne(@Param('id') id: number, @User('sub') userId: number, @User('tipo') tipo: string): Promise<Usuario> {
      if (+id !== userId && tipo !== 'administrador') {
        throw new ForbiddenException('Acesso negado');
      }
      return this.usuarioService.findById(id);
    }
  
    @UseGuards(AuthGuard)
    @Put(':id')
    async update(
      @Param('id') id: number,
      @Body() dto: Partial<CreateUsuarioDto>,
      @User('sub') userId: number,
      @User('tipo') tipo: string,
    ): Promise<Usuario> {
      if (+id !== userId && tipo !== 'administrador') {
        throw new ForbiddenException('Acesso negado');
      }
      return this.usuarioService.update(id, dto);
    }
  
    @UseGuards(AuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: number, @User('tipo') tipo: string): Promise<{ message: string }> {
      if (tipo !== 'administrador') {
        throw new ForbiddenException('Apenas administradores podem remover usuários');
      }
      return this.usuarioService.remove(id);
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