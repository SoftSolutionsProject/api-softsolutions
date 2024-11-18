import request from 'supertest';
import app from '../../server';
import { connectTestDatabase, disconnectTestDatabase } from '../../config/testDatabase';

let server: any;

jest.mock('../../middlewares/authMiddleware', () => ({
    authMiddleware: (req: any, res: any, next: any) => {
      req.user = { _idUser: 1, tipo: 'aluno' }; // Mocka um usuário autenticado
      next();
    },
  }));
  

beforeAll(async () => {
  await connectTestDatabase();
  server = app.listen(0); // Use uma porta aleatória
});

afterAll(async () => {
  await server.close(); // Fecha o servidor
  await disconnectTestDatabase(); // Desconecta o banco de teste
});

describe('Inscricao Controller', () => {
  test('Deve inscrever-se em um curso com sucesso', async () => {
    const response = await request(server).post('/api/inscricoes').send({ _idModulo: 1, _idUser: 1 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_idModulo', 1);
    expect(response.body).toHaveProperty('_idUser', 1);
  });

  test('Deve listar inscrições de um usuário', async () => {
    const response = await request(server).get('/api/inscricoes/1');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});
