import { NotFoundException } from '@nestjs/common';
import { DeleteCursoUseCase } from './delete-curso.use-case';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';

describe('DeleteCursoUseCase', () => {
  let useCase: DeleteCursoUseCase;
  let repo: jest.Mocked<CursoRepository>;

  beforeEach(() => {
    repo = { findById: jest.fn(), delete: jest.fn() } as any;
    useCase = new DeleteCursoUseCase(repo);
  });

  it('deve deletar curso se existir', async () => {
  repo.findById.mockResolvedValue({
    id: 1,
    nomeCurso: 'Curso Teste',
    tempoCurso: 10,
    descricaoCurta: 'Descrição curta',
    descricaoDetalhada: 'Descrição detalhada',
    professor: 'Prof. Teste',
    categoria: 'Categoria Teste',
    status: 'ativo',
    avaliacao: 0,
    imagemCurso: 'imagem.png',
  });
  repo.delete.mockResolvedValue();
  const result = await useCase.execute(1);
  expect(result).toEqual({ message: 'Curso removido com sucesso' });
  expect(repo.findById).toHaveBeenCalledWith(1);
  expect(repo.delete).toHaveBeenCalledWith(1);
});

});
