import { AtualizarAvaliacaoUseCase } from './atualizar-avaliacao.use-case';
import { AvaliacaoRepository } from '../../../infrastructure/database/repositories/avaliacao.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('AtualizarAvaliacaoUseCase', () => {
  let useCase: AtualizarAvaliacaoUseCase;
  let avaliacaoRepo: jest.Mocked<AvaliacaoRepository>;
  let cursoRepo: jest.Mocked<CursoRepository>;

  const usuarioId = 1;
  const avaliacaoId = 10;
  const cursoId = 100;

  const entityMock = {
  id: avaliacaoId,
  nota: 4,
  comentario: 'Bom curso',
  criadoEm: new Date(),
  atualizadoEm: new Date(),
  usuario: {
    id: usuarioId,
    nomeUsuario: 'Lucas',
    cpfUsuario: '000',
    email: 'x',
    senha: 'x',
    tipo: 'aluno' as 'aluno',
    inscricoes: [],
  },
curso: {
  id: cursoId,
  nomeCurso: 'Curso Teste',
  tempoCurso: 10,
  descricaoCurta: 'Curta',
  descricaoDetalhada: 'Detalhada',
  categoria: 'Programação',
  status: 'ativo' as 'ativo', // 👈 Força o literal
  imagemCurso: 'imagem.jpg',
  avaliacao: 4,
  professor: 'Professor Teste',
  modulos: [],
  inscricoes: [],
},
};


  beforeEach(() => {
    avaliacaoRepo = {
      findById: jest.fn(),
      save: jest.fn(),
      getCourseAverage: jest.fn(),
      toModel: jest.fn(),
    } as any;

    cursoRepo = {
      update: jest.fn(),
    } as any;

    useCase = new AtualizarAvaliacaoUseCase(avaliacaoRepo, cursoRepo);
  });

  it('deve lançar NotFoundException se avaliação não encontrada', async () => {
    avaliacaoRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(usuarioId, avaliacaoId, { nota: 5, comentario: 'Ok' }))
      .rejects
      .toThrow(NotFoundException);
  });

  it('deve lançar ForbiddenException se usuário não for dono', async () => {
    avaliacaoRepo.findById.mockResolvedValue({
      ...entityMock,
      usuario: { ...entityMock.usuario, id: 999, inscricoes: [], tipo: 'aluno' }
    });
    await expect(useCase.execute(usuarioId, avaliacaoId, { nota: 5 }))
      .rejects
      .toThrow(ForbiddenException);
  });

  it('deve atualizar avaliação, recalcular média e retornar modelo', async () => {
    avaliacaoRepo.findById.mockResolvedValue(entityMock);
    avaliacaoRepo.save.mockResolvedValue({ ...entityMock, nota: 5, comentario: 'Atualizado' });
    avaliacaoRepo.getCourseAverage.mockResolvedValue(4.5);
    avaliacaoRepo.toModel.mockReturnValue({
      id: avaliacaoId,
      nota: 5,
      comentario: 'Atualizado',
      criadoEm: new Date(),
      atualizadoEm: new Date(),
      usuarioId: usuarioId,
      cursoId: cursoId,
    });

    const result = await useCase.execute(usuarioId, avaliacaoId, { nota: 5, comentario: 'Atualizado' });

    expect(avaliacaoRepo.findById).toHaveBeenCalledWith(avaliacaoId);
    expect(avaliacaoRepo.save).toHaveBeenCalled();
    expect(avaliacaoRepo.getCourseAverage).toHaveBeenCalledWith(cursoId);
    expect(cursoRepo.update).toHaveBeenCalledWith(cursoId, { avaliacao: 4.5 });
    expect(result).toMatchObject({
      id: avaliacaoId,
      nota: 5,
      comentario: 'Atualizado',
      usuarioId: usuarioId,
      cursoId: cursoId,
    });
  });
});
