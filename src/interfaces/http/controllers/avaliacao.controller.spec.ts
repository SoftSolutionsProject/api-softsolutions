import { AvaliacaoController } from './avaliacao.controller';

describe('AvaliacaoController', () => {
  let controller: AvaliacaoController;
  let criarAvaliacaoUseCase: any;
  let atualizarAvaliacaoUseCase: any;
  let avaliacaoRepo: any;

  beforeEach(() => {
    criarAvaliacaoUseCase = { execute: jest.fn() };
    atualizarAvaliacaoUseCase = { execute: jest.fn() };
    avaliacaoRepo = { findByCourse: jest.fn(), findByUserAndCourse: jest.fn() };

    controller = new AvaliacaoController(
      criarAvaliacaoUseCase,
      atualizarAvaliacaoUseCase,
      avaliacaoRepo,
    );
  });

  it('deve criar uma avaliação', async () => {
    criarAvaliacaoUseCase.execute.mockResolvedValue({ id: 1 });
    const result = await controller.criar(1, { nota: 5, cursoId: 10 });
    expect(criarAvaliacaoUseCase.execute).toHaveBeenCalledWith(1, { nota: 5, cursoId: 10 });
    expect(result).toEqual({ id: 1 });
  });

  it('deve atualizar uma avaliação', async () => {
    atualizarAvaliacaoUseCase.execute.mockResolvedValue({ id: 1 });
    const result = await controller.atualizar(1, 10, { nota: 4 });
    expect(atualizarAvaliacaoUseCase.execute).toHaveBeenCalledWith(1, 10, { nota: 4 });
    expect(result).toEqual({ id: 1 });
  });

  it('deve listar avaliações de um curso', async () => {
    avaliacaoRepo.findByCourse.mockResolvedValue([
      { nota: 5, comentario: 'Ótimo', usuario: { nomeUsuario: 'Lucas' } },
    ]);
    const result = await controller.listarAvaliacoesPorCurso(10);
    expect(result).toEqual([{ nota: 5, comentario: 'Ótimo', autor: 'Lucas' }]);
  });

  it('deve retornar a avaliação do usuário', async () => {
    avaliacaoRepo.findByUserAndCourse.mockResolvedValue({ id: 1 });
    const result = await controller.getMinhaAvaliacao(1, 10);
    expect(result).toEqual({ id: 1 });
  });
});
