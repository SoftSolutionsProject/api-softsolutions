import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { CreateUsuarioUseCase } from '../../../application/use-cases/usuario/create-usuario.use-case';
import { LoginUsuarioUseCase } from '../../../application/use-cases/usuario/login-usuario.use-case';
import { GetUsuarioByIdUseCase } from '../../../application/use-cases/usuario/get-usuario-by-id.use-case';
import { ListUsuarioUseCase } from '../../../application/use-cases/usuario/list-usuario.use-case';
import { UpdateUsuarioUseCase } from '../../../application/use-cases/usuario/update-usuario.use-case';
import { DeleteUsuarioUseCase } from '../../../application/use-cases/usuario/delete-usuario.use-case';
import { ForbiddenException } from '@nestjs/common';

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let createUsuario: jest.Mocked<CreateUsuarioUseCase>;
  let loginUsuario: jest.Mocked<LoginUsuarioUseCase>;
  let getUsuarioById: jest.Mocked<GetUsuarioByIdUseCase>;
  let listUsuario: jest.Mocked<ListUsuarioUseCase>;
  let updateUsuario: jest.Mocked<UpdateUsuarioUseCase>;
  let deleteUsuario: jest.Mocked<DeleteUsuarioUseCase>;

  const usuarioMock = {
    id: 1,
    nomeUsuario: 'Lucas',
    cpfUsuario: '04852227012',
    email: 'lucas@email.com',
    tipo: 'aluno' as 'aluno',
  };

  beforeEach(async () => {
    createUsuario = { execute: jest.fn() } as any;
    loginUsuario = { execute: jest.fn() } as any;
    getUsuarioById = { execute: jest.fn() } as any;
    listUsuario = { execute: jest.fn() } as any;
    updateUsuario = { execute: jest.fn() } as any;
    deleteUsuario = { execute: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        { provide: CreateUsuarioUseCase, useValue: createUsuario },
        { provide: LoginUsuarioUseCase, useValue: loginUsuario },
        { provide: GetUsuarioByIdUseCase, useValue: getUsuarioById },
        { provide: ListUsuarioUseCase, useValue: listUsuario },
        { provide: UpdateUsuarioUseCase, useValue: updateUsuario },
        { provide: DeleteUsuarioUseCase, useValue: deleteUsuario },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
  });

  it('deve criar usuário', async () => {
    createUsuario.execute.mockResolvedValue(usuarioMock as any);

    await expect(controller.create({} as any)).resolves.toHaveProperty('id');
    expect(createUsuario.execute).toHaveBeenCalled();
  });

  it('deve fazer login repassando email e senha', async () => {
    loginUsuario.execute.mockResolvedValue({
      access_token: 'token',
      usuario: {
        id: usuarioMock.id,
        nome: usuarioMock.nomeUsuario,
        email: usuarioMock.email,
        tipo: usuarioMock.tipo,
      },
    } as any);

    await expect(controller.login({ email: 'a', senha: 'b' } as any)).resolves.toHaveProperty(
      'access_token',
    );
    expect(loginUsuario.execute).toHaveBeenCalledWith('a', 'b');
  });

  it('deve listar usuários se admin', async () => {
    listUsuario.execute.mockResolvedValue([usuarioMock as any]);

    await expect(controller.list('administrador')).resolves.toHaveLength(1);
  });

  it('deve negar listagem se não admin', async () => {
    await expect(controller.list('aluno')).rejects.toThrow(ForbiddenException);
  });

  it('deve pegar usuário por ID se admin ou dono e validar id inválido', async () => {
    getUsuarioById.execute.mockResolvedValue(usuarioMock as any);

    await expect(controller.getById('1', 1, 'aluno')).resolves.toHaveProperty('id');
    await expect(controller.getById('1', 99, 'administrador')).resolves.toHaveProperty(
      'id',
    );
    await expect(controller.getById('abc', 1, 'aluno')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('deve negar getById se não for admin nem dono', async () => {
    await expect(controller.getById('1', 2, 'aluno')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('deve atualizar usuário se admin ou dono e validar id inválido', async () => {
    updateUsuario.execute.mockResolvedValue(usuarioMock as any);

    await expect(controller.update('1', {}, 1, 'aluno')).resolves.toHaveProperty('id');
    await expect(controller.update('1', {}, 99, 'administrador')).resolves.toHaveProperty(
      'id',
    );
    await expect(controller.update('abc', {}, 1, 'aluno')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('deve negar update se não for admin nem dono', async () => {
    await expect(controller.update('1', {}, 2, 'aluno')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('deve deletar usuário se admin ou dono e validar id inválido', async () => {
    deleteUsuario.execute.mockResolvedValue({ message: 'OK' } as any);

    await expect(controller.delete('1', 1, 'aluno')).resolves.toEqual({
      message: 'OK',
    });
    await expect(controller.delete('1', 99, 'administrador')).resolves.toEqual({
      message: 'OK',
    });
    expect(() => controller.delete('abc', 1, 'aluno')).toThrow(ForbiddenException);
  });

  it('deve negar delete se não for admin nem dono', () => {
    expect(() => controller.delete('1', 2, 'aluno')).toThrow(ForbiddenException);
  });
});
