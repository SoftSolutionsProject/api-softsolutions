import { UsuarioModel } from './usuario.model';

describe('UsuarioModel', () => {
  it('deve criar um modelo de usuário', () => {
    const model: UsuarioModel = {
      id: 1,
      nomeUsuario: 'Teste',
      cpfUsuario: '123',
      email: 'teste@teste.com',
      senha: '123',
      tipo: 'aluno',
      telefone: '999',
    };
    expect(model).toBeDefined();
    expect(model.nomeUsuario).toBe('Teste');
  });

  it('deve criar modelo de administrador', () => {
    const model: UsuarioModel = {
      id: 2,
      nomeUsuario: 'Admin',
      cpfUsuario: '456',
      email: 'admin@teste.com',
      senha: 'senha123',
      tipo: 'administrador',
      telefone: '888',
    };
    expect(model).toBeDefined();
    expect(model.tipo).toBe('administrador');
  });
});
