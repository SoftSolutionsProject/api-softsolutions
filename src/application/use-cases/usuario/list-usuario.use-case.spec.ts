import { ListUsuarioUseCase } from './list-usuario.use-case';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import { UsuarioModel } from '../../../domain/models/usuario.model';

describe('ListUsuarioUseCase', () => {
  let useCase: ListUsuarioUseCase;
  let usuarioRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    usuarioRepo = { findAll: jest.fn() } as any;
    useCase = new ListUsuarioUseCase(usuarioRepo);
  });

  it('deve listar usuários sem senha', async () => {
    const usuarios: UsuarioModel[] = [
      {
        id: 1,
        nomeUsuario: 'Lucas',
        cpfUsuario: '04852227012',
        email: 'lucas@email.com',
        senha: 'hash',
        tipo: 'aluno',
      },
      {
        id: 2,
        nomeUsuario: 'Maria',
        cpfUsuario: '31239985000',
        email: 'maria@email.com',
        senha: 'hash',
        tipo: 'aluno',
      },
    ];

    usuarioRepo.findAll.mockResolvedValue(usuarios);

    const result = await useCase.execute();

    result.forEach((u) => {
      expect(u).not.toHaveProperty('senha');
    });
    expect(result).toHaveLength(2);
  });
});
