import { ListCursoUseCase } from './list-curso.use-case';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';

describe('ListCursoUseCase', () => {
  let useCase: ListCursoUseCase;
  let repo: jest.Mocked<CursoRepository>;

  beforeEach(() => {
    repo = { findAll: jest.fn() } as any;
    useCase = new ListCursoUseCase(repo);
  });

  it('deve retornar lista de cursos', async () => {
    repo.findAll.mockResolvedValue([
      {
        id: 1,
        nomeCurso: 'Curso 1',
        tempoCurso: 20,
        descricaoCurta: 'Curta',
        descricaoDetalhada: 'Detalhada',
        professor: 'Prof',
        categoria: 'Cat',
        status: 'ativo',
        avaliacao: 0,
        imagemCurso: 'img.png',
      },
    ]);

    const result = await useCase.execute();
    expect(result).toHaveLength(1);
    expect(repo.findAll).toHaveBeenCalled();
  });
});
