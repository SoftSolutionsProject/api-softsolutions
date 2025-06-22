import { CreateCursoUseCase } from './create-curso.use-case';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';

describe('CreateCursoUseCase', () => {
  let useCase: CreateCursoUseCase;
  let cursoRepo: jest.Mocked<CursoRepository>;

  beforeEach(() => {
    cursoRepo = { create: jest.fn() } as any;
    useCase = new CreateCursoUseCase(cursoRepo);
  });

  it('deve criar um curso com os valores padrão', async () => {
    const data = {
      nomeCurso: 'Curso Teste',
      tempoCurso: 40,
      descricaoCurta: 'Descrição curta',
      descricaoDetalhada: 'Descrição detalhada',
      professor: 'Prof. Teste',
      categoria: 'Programação',
      imagemCurso: 'https://exemplo.com/imagem.png',
    };

    cursoRepo.create.mockResolvedValue({
      id: 1,
      ...data,
      status: 'ativo',
      avaliacao: 0,
    });

    const result = await useCase.execute(data);

    expect(cursoRepo.create).toHaveBeenCalledWith({
      status: 'ativo',
      avaliacao: 0,
      ...data,
    });
    expect(result).toHaveProperty('id', 1);
  });
});
