import { CreateUsuarioUseCase } from './create-usuario.use-case';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';

describe('CreateUsuarioUseCase', () => {
  let useCase: CreateUsuarioUseCase;
  let usuarioRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    usuarioRepo = {
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      create: jest.fn(),
    } as any;

    useCase = new CreateUsuarioUseCase(usuarioRepo);
  });

  it('deve criar usuário com sucesso', async () => {
    usuarioRepo.findByEmail.mockResolvedValue(null);
    usuarioRepo.findByCpf.mockResolvedValue(null);
    usuarioRepo.create.mockImplementation(async (data) => ({
      id: 1,
      nomeUsuario: data.nomeUsuario ?? 'Lucas',
      cpfUsuario: data.cpfUsuario ?? '04852227012',
      email: data.email ?? 'lucas@email.com',
      senha: data.senha ?? 'hashed',
      telefone: data.telefone ?? '',
      endereco: data.endereco ?? {},
      localizacao: data.localizacao ?? {},
      tipo: 'aluno',
    }));

    const input = {
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: '123456',
    };

    const result = await useCase.execute(input);

    expect(usuarioRepo.create).toHaveBeenCalled();
    expect(result).toHaveProperty('id');
    expect(result).not.toHaveProperty('senha');
  });

  it.each([
    ['11999999999', '(11) 99999-9999'],
    ['1133334444', '(11) 3333-4444'],
  ])('deve formatar telefone %s', async (telefone, formatado) => {
    usuarioRepo.findByEmail.mockResolvedValue(null);
    usuarioRepo.findByCpf.mockResolvedValue(null);
    usuarioRepo.create.mockImplementation(
      async (data) =>
        ({
          id: 1,
          ...data,
        }) as any,
    );

    const result = await useCase.execute({
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: '123456',
      telefone,
    });

    expect(result.telefone).toBe(formatado);
  });

  it.each(['123', '12345678901', '04852227013'])(
    'deve rejeitar CPF inválido %s',
    async (cpfUsuario) => {
      await expect(
        useCase.execute({
          nomeUsuario: 'Lucas',
          cpfUsuario,
          email: 'lucas@email.com',
          senha: '123456',
        }),
      ).rejects.toThrow('CPF inválido');
    },
  );

  it('deve lançar erro se CPF inválido', async () => {
    const input = {
      nomeUsuario: 'Lucas',
      cpfUsuario: '11111111111',
      email: 'lucas@email.com',
      senha: '123456',
    };
    await expect(useCase.execute(input)).rejects.toThrow('CPF inválido');
  });

  it('deve lançar erro se email já existir', async () => {
    usuarioRepo.findByEmail.mockResolvedValue({
      id: 1,
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: 'hashed',
      tipo: 'aluno',
    });

    const input = {
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: '123456',
    };
    await expect(useCase.execute(input)).rejects.toThrow('Email já cadastrado');
  });

  it('deve lançar erro se CPF já existir', async () => {
    usuarioRepo.findByEmail.mockResolvedValue(null);
    usuarioRepo.findByCpf.mockResolvedValue({
      id: 1,
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: 'hashed',
      tipo: 'aluno',
    });

    const input = {
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: '123456',
    };
    await expect(useCase.execute(input)).rejects.toThrow('CPF já cadastrado');
  });
});
