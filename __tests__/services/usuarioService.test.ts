import * as usuarioService from '../../services/usuarioService';
import { connectTestDatabase, disconnectTestDatabase } from '../../config/testDatabase';

beforeAll(async () => {
  await connectTestDatabase();
});

afterAll(async () => {
  await disconnectTestDatabase();
});

describe('UsuarioService', () => {
  it('Deve cadastrar um usuário com sucesso', async () => {
    const user = await usuarioService.cadastrarUsuario({
      nomeUsuario: 'Test User',
      cpfUsuario: '526.926.610-52',
      senha: 'password123',
      email: 'test@example.com',
    });

    expect(user.user).toHaveProperty('_idUser');
    expect(user).toHaveProperty('token');
  });

  it('Deve falhar ao cadastrar um usuário com CPF duplicado', async () => {
    await expect(
      usuarioService.cadastrarUsuario({
        nomeUsuario: 'Test User 2',
        cpfUsuario: '526.926.610-52',
        senha: 'password123',
        email: 'test2@example.com',
      })
    ).rejects.toThrow('CPF já cadastrado');
  });
});
