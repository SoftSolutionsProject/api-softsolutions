import { NotFoundException } from '@nestjs/common';
import { GetCursoByIdUseCase } from './get-curso-by-id.use-case';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';

describe('GetCursoByIdUseCase', () => {
  let useCase: GetCursoByIdUseCase;
  let repo: jest.Mocked<CursoRepository>;

  beforeEach(() => {
    repo = { findById: jest.fn() } as any;
    useCase = new GetCursoByIdUseCase(repo);
  });

  it('deve retornar curso se encontrado', async () => {
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
    const result = await useCase.execute(1);
    expect(result).toHaveProperty('id');
    expect(repo.findById).toHaveBeenCalledWith(1);
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });
});
