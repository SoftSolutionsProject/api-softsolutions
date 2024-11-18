import request from 'supertest';
import app from '../../server';
import { connectTestDatabase, disconnectTestDatabase } from '../../config/testDatabase';

beforeAll(async () => {
  await connectTestDatabase();
});

afterAll(async () => {
  await disconnectTestDatabase();
});

describe('UsuarioController', () => {
  it('Deve cadastrar um novo usuário', async () => {
    const response = await request(app)
      .post('/api/usuarios/cadastro')
      .send({
        nomeUsuario: 'Test User',
        cpfUsuario: '123.456.789-00',
        senha: 'password123',
        email: 'test@example.com',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
  });

  it('Deve realizar login com sucesso', async () => {
    const response = await request(app)
      .post('/api/usuarios/login')
      .send({ email: 'test@example.com', senha: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
