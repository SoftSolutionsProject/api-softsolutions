import { AvaliacaoModel } from './avaliacao.model';

describe('AvaliacaoModel', () => {
  it('deve criar um modelo de avaliação', () => {
    const model: AvaliacaoModel = {
      id: 1,
      nota: 5,
      comentario: 'Ótimo',
      criadoEm: new Date(),
      atualizadoEm: new Date(),
      usuarioId: 1,
      cursoId: 1,
    };
    expect(model).toBeDefined();
    expect(model.nota).toBe(5);
    expect(model.usuarioId).toBe(1);
  });

  it('deve criar modelo sem id', () => {
    const model: AvaliacaoModel = {
      id: 0,
      nota: 4,
      comentario: 'Bom',
      criadoEm: new Date(),
      atualizadoEm: new Date(),
      usuarioId: 2,
      cursoId: 3,
    };
    expect(model).toBeDefined();
    expect(model.nota).toBe(4);
    expect(model.comentario).toBe('Bom');
  });
});
