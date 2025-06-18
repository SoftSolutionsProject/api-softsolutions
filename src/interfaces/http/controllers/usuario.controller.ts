import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
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
import { CreateUsuarioDto } from '../dtos/requests/create-usuario.dto';
import { LoginUsuarioDto } from '../dtos/requests/login-usuario.dto';
import { UpdateUsuarioDto } from '../dtos/requests/update-usuario.dto';
import { CreateUsuarioUseCase } from '../../../application/use-cases/usuario/create-usuario.use-case';
import { DeleteUsuarioUseCase } from '../../../application/use-cases/usuario/delete-usuario.use-case';
import { GetUsuarioByIdUseCase } from '../../../application/use-cases/usuario/get-usuario-by-id.use-case';
import { ListUsuarioUseCase } from '../../../application/use-cases/usuario/list-usuario.use-case';
import { LoginUsuarioUseCase } from '../../../application/use-cases/usuario/login-usuario.use-case';
import { UpdateUsuarioUseCase } from '../../../application/use-cases/usuario/update-usuario.use-case';
import { UsuarioResponseDto } from '../dtos/responses/usuario.response.dto';
import { LoginUsuarioResponseDto } from '../dtos/responses/login-usuario.response.dto';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuarioController {
  constructor(
    private readonly createUsuario: CreateUsuarioUseCase,
    private readonly loginUsuario: LoginUsuarioUseCase,
    private readonly getUsuarioById: GetUsuarioByIdUseCase,
    private readonly listUsuario: ListUsuarioUseCase,
    private readonly updateUsuario: UpdateUsuarioUseCase,
    private readonly deleteUsuario: DeleteUsuarioUseCase,
  ) {}

  @Post('cadastro')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastrar novo usuário' })
  @ApiResponse({ status: 201, type: UsuarioResponseDto })
  async create(@Body() dto: CreateUsuarioDto) {
    const usuario = await this.createUsuario.execute(dto);
    return new UsuarioResponseDto(usuario);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiResponse({ status: 200, type: LoginUsuarioResponseDto })
  login(@Body() dto: LoginUsuarioDto) {
    return this.loginUsuario.execute(dto.email, dto.senha);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários (apenas admins)' })
  @ApiResponse({ status: 200, type: [UsuarioResponseDto] })
  async list(@User('tipo') tipo: string) {
    if (tipo !== 'administrador')
      throw new ForbiddenException('Apenas administradores podem listar usuários');

    const usuarios = await this.listUsuario.execute();
    return usuarios.map((u) => new UsuarioResponseDto(u));
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiResponse({ status: 200, type: UsuarioResponseDto })
  async getById(
    @Param('id') id: string,
    @User('sub') userId: number,
    @User('tipo') tipo: string,
  ) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) throw new ForbiddenException('ID inválido');
    if (idNumber !== userId && tipo !== 'administrador')
      throw new ForbiddenException('Acesso negado');

    const usuario = await this.getUsuarioById.execute(idNumber);
    return new UsuarioResponseDto(usuario);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar dados do usuário' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiResponse({ status: 200, type: UsuarioResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUsuarioDto,
    @User('sub') userId: number,
    @User('tipo') tipo: string,
  ) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) throw new ForbiddenException('ID inválido');
    if (idNumber !== userId && tipo !== 'administrador')
      throw new ForbiddenException('Acesso negado');

    const usuario = await this.updateUsuario.execute(idNumber, dto);
    return new UsuarioResponseDto(usuario);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Deletar usuário' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  delete(
    @Param('id') id: string,
    @User('sub') userId: number,
    @User('tipo') tipo: string,
  ) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) throw new ForbiddenException('ID inválido');
    if (idNumber !== userId && tipo !== 'administrador')
      throw new ForbiddenException('Acesso negado');
    return this.deleteUsuario.execute(idNumber);
  }
}
