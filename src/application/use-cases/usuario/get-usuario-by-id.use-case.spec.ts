import { GetUsuarioByIdUseCase } from './get-usuario-by-id.use-case';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import { UsuarioModel } from '../../../domain/models/usuario.model';

describe('GetUsuarioByIdUseCase', () => {
  let useCase: GetUsuarioByIdUseCase;
  let usuarioRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    usuarioRepo = { findById: jest.fn() } as any;
    useCase = new GetUsuarioByIdUseCase(usuarioRepo);
  });

  it('deve retornar o usuário sem senha', async () => {
    const usuario: UsuarioModel = {
      id: 1,
      nomeUsuario: 'Lucas',
      cpfUsuario: '04852227012',
      email: 'lucas@email.com',
      senha: 'hash',
      tipo: 'aluno',
    };
    usuarioRepo.findById.mockResolvedValue(usuario);

    const result = await useCase.execute(1);

    expect(result).not.toHaveProperty('senha');
    expect(result.id).toBe(1);
  });

  it('deve lançar erro se não encontrar usuário', async () => {
    usuarioRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1)).rejects.toThrow('Usuário não encontrado');
  });
});
