import { UpdateUsuarioUseCase } from './update-usuario.use-case';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import * as bcrypt from 'bcrypt';
import { UsuarioModel } from '../../../domain/models/usuario.model';

describe('UpdateUsuarioUseCase', () => {
  let useCase: UpdateUsuarioUseCase;
  let usuarioRepo: jest.Mocked<UsuarioRepository>;

  const usuarioBase: UsuarioModel = {
    id: 1,
    nomeUsuario: 'Lucas',
    cpfUsuario: '04852227012',
    email: 'lucas@email.com',
    senha: 'hash-atual',
    tipo: 'aluno',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    usuarioRepo = { findById: jest.fn(), update: jest.fn() } as any;
    useCase = new UpdateUsuarioUseCase(usuarioRepo);
  });

  it('deve atualizar usuário com telefone formatado em 11 dígitos', async () => {
    usuarioRepo.findById.mockResolvedValue(usuarioBase);
    usuarioRepo.update.mockImplementation(async (_id, data) => ({
      ...usuarioBase,
      ...data,
    }));

    const result = await useCase.execute(1, { telefone: '11999999999' });

    expect(usuarioRepo.update).toHaveBeenCalledWith(1, {
      telefone: '(11) 99999-9999',
    });
    expect(result).not.toHaveProperty('senha');
  });

  it('deve atualizar usuário com telefone formatado em 10 dígitos', async () => {
    usuarioRepo.findById.mockResolvedValue(usuarioBase);
    usuarioRepo.update.mockImplementation(async (_id, data) => ({
      ...usuarioBase,
      ...data,
    }));

    const result = await useCase.execute(1, { telefone: '1133334444' });

    expect(result.telefone).toBe('(11) 3333-4444');
  });

  it('deve lançar erro se usuário não for encontrado', async () => {
    usuarioRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, {})).rejects.toThrow(
      'Usuário não encontrado',
    );
  });

  it('deve lançar erro se tentar alterar CPF', async () => {
    usuarioRepo.findById.mockResolvedValue(usuarioBase);

    await expect(
      useCase.execute(1, { cpfUsuario: '12345678900' }),
    ).rejects.toThrow('Não é permitido alterar o CPF');
  });

  it('deve lançar erro para email inválido', async () => {
    usuarioRepo.findById.mockResolvedValue(usuarioBase);

    await expect(useCase.execute(1, { email: 'invalido' })).rejects.toThrow(
      'Email inválido',
    );
  });

  it('deve lançar erro para telefone inválido', async () => {
    usuarioRepo.findById.mockResolvedValue(usuarioBase);

    await expect(useCase.execute(1, { telefone: '123' })).rejects.toThrow(
      'Telefone inválido',
    );
  });

  it('deve remover alteração de tipo e manter senha quando já corresponder ao hash', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    usuarioRepo.findById.mockResolvedValue(usuarioBase);
    usuarioRepo.update.mockImplementation(async (_id, data) => ({
      ...usuarioBase,
      ...data,
    }));

    await useCase.execute(1, { tipo: 'administrador', senha: '123456' });

    expect(usuarioRepo.update).toHaveBeenCalledWith(1, { senha: '123456' });
    expect(hashSpy).not.toHaveBeenCalled();
  });

  it('deve gerar novo hash quando a senha for diferente', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('novo-hash' as never);
    usuarioRepo.findById.mockResolvedValue(usuarioBase);
    usuarioRepo.update.mockImplementation(async (_id, data) => ({
      ...usuarioBase,
      ...data,
    }));

    await useCase.execute(1, { senha: 'nova-senha' });

    expect(usuarioRepo.update).toHaveBeenCalledWith(1, { senha: 'novo-hash' });
  });
});
