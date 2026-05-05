import { CursoModel } from './curso.model';

describe('CursoModel', () => {
  it('deve criar um modelo de curso', () => {
    const model: CursoModel = {
      id: 1,
      nomeCurso: 'Curso Teste',
      tempoCurso: 10,
      descricaoCurta: 'Curta',
      descricaoDetalhada: 'Detalhada',
      professor: 'Prof',
      categoria: 'Cat',
      status: 'ativo',
      avaliacao: 5,
      imagemCurso: 'img.png',
      modulos: [],
    };
    expect(model).toBeDefined();
    expect(model.nomeCurso).toBe('Curso Teste');
  });
});
