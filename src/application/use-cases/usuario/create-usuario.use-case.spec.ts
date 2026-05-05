import { CreateUsuarioUseCase } from './create-usuario.use-case';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import * as bcrypt from 'bcrypt';

describe('CreateUsuarioUseCase', () => {
  let useCase: CreateUsuarioUseCase;
  let usuarioRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    usuarioRepo = {
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      create: jest.fn(),
    } as any;

    useCase = new CreateUsuarioUseCase(usuarioRepo);
  });

  it('deve criar usuário com senha hash, tipo aluno e telefone formatado com 11 dígitos', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);
    usuarioRepo.findByEmail.mockResolvedValue(null);
    usuarioRepo.findByCpf.mockResolvedValue(null);
    usuarioRepo.create.mockImplementation(async (data) => ({
      id: 1,
      ...data,
    } as any));

    const result = await useCase.execute({
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: '123456',
      telefone: '11999999999',
      tipo: 'administrador',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    expect(usuarioRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        senha: 'hashed',
        tipo: 'aluno',
        telefone: '(11) 99999-9999',
      }),
    );
    expect(result).not.toHaveProperty('senha');
  });

  it('deve formatar telefone com 10 dígitos', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);
    usuarioRepo.findByEmail.mockResolvedValue(null);
    usuarioRepo.findByCpf.mockResolvedValue(null);
    usuarioRepo.create.mockImplementation(async (data) => ({
      id: 1,
      ...data,
    } as any));

    const result = await useCase.execute({
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: '123456',
      telefone: '1133334444',
    });

    expect(result.telefone).toBe('(11) 3333-4444');
  });

  it('deve criar usuário sem telefone quando ele não for informado', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);
    usuarioRepo.findByEmail.mockResolvedValue(null);
    usuarioRepo.findByCpf.mockResolvedValue(null);
    usuarioRepo.create.mockImplementation(async (data) => ({
      id: 1,
      ...data,
    } as any));

    const result = await useCase.execute({
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: '123456',
    });

    expect(result.telefone).toBeUndefined();
  });

  it('deve lançar erro se CPF inválido', async () => {
    await expect(
      useCase.execute({
        nomeUsuario: 'Lucas',
        cpfUsuario: '11111111111',
        email: 'lucas@email.com',
        senha: '123456',
      }),
    ).rejects.toThrow('CPF inválido');
    expect(usuarioRepo.findByEmail).not.toHaveBeenCalled();
  });

  it('deve lançar erro se email já existir', async () => {
    usuarioRepo.findByEmail.mockResolvedValue({ id: 1 } as any);

    await expect(
      useCase.execute({
        nomeUsuario: 'Lucas',
        cpfUsuario: '04852227012',
        email: 'lucas@email.com',
        senha: '123456',
      }),
    ).rejects.toThrow('Email já cadastrado');
    expect(usuarioRepo.findByCpf).not.toHaveBeenCalled();
  });

  it('deve lançar erro se CPF já existir', async () => {
    usuarioRepo.findByEmail.mockResolvedValue(null);
    usuarioRepo.findByCpf.mockResolvedValue({ id: 1 } as any);

    await expect(
      useCase.execute({
        nomeUsuario: 'Lucas',
        cpfUsuario: '04852227012',
        email: 'lucas@email.com',
        senha: '123456',
      }),
    ).rejects.toThrow('CPF já cadastrado');
  });

  it('deve validar CPF formatado e cobrir os ramos de resto especial', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);
    usuarioRepo.findByEmail.mockResolvedValue(null);
    usuarioRepo.findByCpf.mockResolvedValue(null);
    usuarioRepo.create.mockImplementation(async (data) => ({
      id: 2,
      ...data,
    } as any));

    await expect(
      useCase.execute({
        nomeUsuario: 'Lucas',
        cpfUsuario: '000.000.281-00',
        email: 'outro@email.com',
        senha: '123456',
      }),
    ).resolves.toHaveProperty('id', 2);
    expect((useCase as any).validarCpf('00000028101')).toBe(false);
  });
});
