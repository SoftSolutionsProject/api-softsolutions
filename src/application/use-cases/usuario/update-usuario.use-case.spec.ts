import { UpdateUsuarioUseCase } from './update-usuario.use-case';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import * as bcrypt from 'bcrypt';
import { UsuarioModel } from '../../../domain/models/usuario.model';

describe('UpdateUsuarioUseCase', () => {
  let useCase: UpdateUsuarioUseCase;
  let usuarioRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    usuarioRepo = { findById: jest.fn(), update: jest.fn() } as any;
    useCase = new UpdateUsuarioUseCase(usuarioRepo);
  });

  it('deve atualizar usuário com sucesso', async () => {
    const usuario: UsuarioModel = {
      id: 1,
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: await bcrypt.hash('123456', 10),
      tipo: 'aluno',
    };
    usuarioRepo.findById.mockResolvedValue(usuario);
    usuarioRepo.update.mockImplementation(async (id, data) => ({
      ...usuario,
      ...data,
    }));

    const result = await useCase.execute(1, { telefone: '11999999999' });
    expect(result).not.toHaveProperty('senha');
    expect(result.telefone).toBe('(11) 99999-9999');
  });

  it('deve lançar erro se usuário não encontrado', async () => {
    usuarioRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1, {})).rejects.toThrow(
      'Usuário não encontrado',
    );
  });

  it('deve lançar erro se tentar alterar CPF', async () => {
    const usuario: UsuarioModel = {
      id: 1,
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: 'hash',
      tipo: 'aluno',
    };
    usuarioRepo.findById.mockResolvedValue(usuario);

    await expect(
      useCase.execute(1, { cpfUsuario: '12345678900' }),
    ).rejects.toThrow('Não é permitido alterar o CPF');
  });

  it.each([
    [{ email: 'invalido' }, 'Email inválido'],
    [{ telefone: '123' }, 'Telefone inválido'],
  ])('deve validar campos de atualização', async (data, mensagem) => {
    usuarioRepo.findById.mockResolvedValue({
      id: 1,
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: 'hash',
      tipo: 'aluno',
    });
    await expect(useCase.execute(1, data)).rejects.toThrow(mensagem);
  });

  it('deve ignorar alteração de tipo e formatar telefone fixo', async () => {
    const usuario: UsuarioModel = {
      id: 1,
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: 'hash',
      tipo: 'aluno',
    };
    usuarioRepo.findById.mockResolvedValue(usuario);
    usuarioRepo.update.mockImplementation(async (_, data) => ({
      ...usuario,
      ...data,
    }));
    const result = await useCase.execute(1, {
      tipo: 'administrador',
      telefone: '1133334444',
    });
    expect(result.tipo).toBe('aluno');
    expect(result.telefone).toBe('(11) 3333-4444');
  });

  it('deve manter senha igual e gerar hash para senha nova', async () => {
    const usuario: UsuarioModel = {
      id: 1,
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: await bcrypt.hash('atual', 10),
      tipo: 'aluno',
    };
    usuarioRepo.findById.mockResolvedValue(usuario);
    usuarioRepo.update.mockImplementation(async (_, data) => ({
      ...usuario,
      ...data,
    }));

    await useCase.execute(1, { senha: 'atual' });
    expect(usuarioRepo.update).toHaveBeenLastCalledWith(1, { senha: 'atual' });

    await useCase.execute(1, { senha: 'nova' });
    const hashed = usuarioRepo.update.mock.calls.at(-1)?.[1].senha;
    expect(hashed).not.toBe('nova');
    expect(hashed).toBeDefined();
    await expect(bcrypt.compare('nova', hashed!)).resolves.toBe(true);
  });
});
