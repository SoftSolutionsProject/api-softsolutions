import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
  ForbiddenException
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { Usuario } from './usuario.entity';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

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
  async findOne(@Param('id') id: number, @User() user: any): Promise<Usuario> {
    if (id !== user.sub) throw new ForbiddenException('Acesso negado');
    return this.usuarioService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: Partial<CreateUsuarioDto>,
    @User() user: any,
  ): Promise<Usuario> {
    if (id !== user.sub) throw new ForbiddenException('Acesso negado');
    return this.usuarioService.update(id, dto);
  }
}
