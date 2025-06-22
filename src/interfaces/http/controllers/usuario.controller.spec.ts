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

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve criar usuário', async () => {
    createUsuario.execute.mockResolvedValue(usuarioMock);
    const result = await controller.create({} as any);
    expect(createUsuario.execute).toHaveBeenCalled();
    expect(result).toHaveProperty('id');
  });

  it('deve fazer login', async () => {
    loginUsuario.execute.mockResolvedValue({
      access_token: 'token',
      usuario: {
        id: usuarioMock.id,
        nome: usuarioMock.nomeUsuario,
        email: usuarioMock.email,
        tipo: usuarioMock.tipo,
      },
    });

    const result = await controller.login({ email: 'a', senha: 'b' });
    expect(loginUsuario.execute).toHaveBeenCalled();
    expect(result).toHaveProperty('access_token');
  });

  it('deve listar usuários se admin', async () => {
    listUsuario.execute.mockResolvedValue([usuarioMock]);
    const result = await controller.list('administrador');
    expect(listUsuario.execute).toHaveBeenCalled();
    expect(result[0]).toHaveProperty('id');
  });

  it('deve negar listagem se não admin', async () => {
    await expect(controller.list('aluno')).rejects.toThrow(ForbiddenException);
  });

  it('deve pegar usuário por ID se admin ou dono', async () => {
    getUsuarioById.execute.mockResolvedValue(usuarioMock);
    const result = await controller.getById('1', 1, 'aluno');
    expect(getUsuarioById.execute).toHaveBeenCalled();
    expect(result).toHaveProperty('id');

    const adminResult = await controller.getById('1', 99, 'administrador');
    expect(adminResult).toHaveProperty('id');
  });

  it('deve negar getById se não admin nem dono', async () => {
    await expect(controller.getById('1', 2, 'aluno')).rejects.toThrow(ForbiddenException);
  });

  it('deve atualizar usuário se admin ou dono', async () => {
    updateUsuario.execute.mockResolvedValue(usuarioMock);
    const result = await controller.update('1', {}, 1, 'aluno');
    expect(updateUsuario.execute).toHaveBeenCalled();
    expect(result).toHaveProperty('id');

    const adminResult = await controller.update('1', {}, 99, 'administrador');
    expect(adminResult).toHaveProperty('id');
  });

  it('deve negar update se não admin nem dono', async () => {
    await expect(controller.update('1', {}, 2, 'aluno')).rejects.toThrow(ForbiddenException);
  });

  it('deve deletar usuário se admin ou dono', async () => {
    deleteUsuario.execute.mockResolvedValue({ message: 'OK' });
    const result = await controller.delete('1', 1, 'aluno');
    expect(deleteUsuario.execute).toHaveBeenCalled();

    const adminResult = await controller.delete('1', 99, 'administrador');
    expect(adminResult).toEqual({ message: 'OK' });
  });

 it('deve negar delete se não admin nem dono', () => {
  expect(() => controller.delete('1', 2, 'aluno')).toThrow(ForbiddenException);
});

});
