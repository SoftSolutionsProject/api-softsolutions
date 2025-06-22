import { LoginUsuarioUseCase } from './login-usuario.use-case';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsuarioModel } from '../../../domain/models/usuario.model';

describe('LoginUsuarioUseCase', () => {
  let useCase: LoginUsuarioUseCase;
  let usuarioRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    usuarioRepo = { findByEmail: jest.fn() } as any;
    useCase = new LoginUsuarioUseCase(usuarioRepo);
    process.env.JWT_SECRET = 'secret';
  });

  it('deve autenticar com sucesso', async () => {
    const senhaHash = await bcrypt.hash('123456', 10);
    const usuario: UsuarioModel = {
      id: 1,
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: senhaHash,
      tipo: 'aluno',
    };
    usuarioRepo.findByEmail.mockResolvedValue(usuario);

    const result = await useCase.execute(usuario.email, '123456');

    expect(result).toHaveProperty('access_token');
    expect(result).toHaveProperty('usuario');
    expect(result.usuario.email).toBe(usuario.email);
  });

  it('deve lançar erro se email não encontrado', async () => {
    usuarioRepo.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute('naoexiste@email.com', '123456')).rejects.toThrow();
  });

  it('deve lançar erro se senha inválida', async () => {
    const senhaHash = await bcrypt.hash('123456', 10);
    const usuario: UsuarioModel = {
      id: 1,
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: senhaHash,
      tipo: 'aluno',
    };
    usuarioRepo.findByEmail.mockResolvedValue(usuario);

    await expect(useCase.execute(usuario.email, 'senhaerrada')).rejects.toThrow();
  });
});
