import { DeleteUsuarioUseCase } from './delete-usuario.use-case';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import { UsuarioModel } from '../../../domain/models/usuario.model';

describe('DeleteUsuarioUseCase', () => {
  let useCase: DeleteUsuarioUseCase;
  let usuarioRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    usuarioRepo = { findById: jest.fn(), delete: jest.fn() } as any;
    useCase = new DeleteUsuarioUseCase(usuarioRepo);
  });

  it('deve deletar usuário com sucesso', async () => {
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

    expect(usuarioRepo.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: 'Usuário removido com sucesso' });
  });

  it('deve lançar erro se usuário não encontrado', async () => {
    usuarioRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1)).rejects.toThrow('Usuário não encontrado');
  });
});
