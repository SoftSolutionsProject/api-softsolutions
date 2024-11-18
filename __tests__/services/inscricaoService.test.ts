import * as inscricaoService from '../../services/inscricaoService';
import { connectTestDatabase, disconnectTestDatabase } from '../../config/testDatabase';

beforeAll(async () => {
  await connectTestDatabase();
});

afterAll(async () => {
  await disconnectTestDatabase();
});

describe('InscricaoService', () => {
  it('Deve criar uma nova inscrição com sucesso', async () => {
    const inscricao = await inscricaoService.inscreverCurso({
      _idModulo: 78,
      _idUser: 1,
    });

    expect(inscricao).toHaveProperty('_id');
    expect(inscricao.statusInscricao).toBe(0);
  });

  it('Deve falhar ao tentar inscrever em um módulo já inscrito', async () => {
    await expect(
      inscricaoService.inscreverCurso({ _idModulo: 78, _idUser: 1 })
    ).rejects.toThrow('Usuário já está inscrito neste módulo.');
  });
});
