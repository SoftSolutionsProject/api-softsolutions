import { CriarAvaliacaoUseCase } from './criar-avaliacao.use-case';
import { ForbiddenException, BadRequestException } from '@nestjs/common';

describe('CriarAvaliacaoUseCase', () => {
  let useCase: CriarAvaliacaoUseCase;
  let avaliacaoRepo: any;
  let inscricaoRepo: any;
  let certificadoRepo: any;
  let cursoRepo: any;
  let usuarioRepo: any;

  const userId = 1;
  const cursoId = 10;
  const dto = { nota: 5, comentario: 'Ótimo', cursoId };

  beforeEach(() => {
    avaliacaoRepo = {
      findByUserAndCourse: jest.fn(),
      create: jest.fn(),
      getCourseAverage: jest.fn(),
      toModel: jest.fn(),
    };
    inscricaoRepo = { findByUsuarioAndCurso: jest.fn() };
    certificadoRepo = { findByInscricao: jest.fn() };
    cursoRepo = { findById: jest.fn(), update: jest.fn() };
    usuarioRepo = { findById: jest.fn() };

    useCase = new CriarAvaliacaoUseCase(
      avaliacaoRepo, inscricaoRepo, certificadoRepo, cursoRepo, usuarioRepo,
    );
  });

  it('deve lançar Forbidden se usuário não for aluno', async () => {
    usuarioRepo.findById.mockResolvedValue({ tipo: 'administrador' });
    await expect(useCase.execute(userId, dto)).rejects.toThrow(ForbiddenException);
  });

  it('deve lançar Forbidden se usuário não estiver inscrito', async () => {
    usuarioRepo.findById.mockResolvedValue({ tipo: 'aluno' });
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue(null);
    await expect(useCase.execute(userId, dto)).rejects.toThrow(ForbiddenException);
  });

  it('deve lançar Forbidden se não tiver certificado', async () => {
    usuarioRepo.findById.mockResolvedValue({ tipo: 'aluno' });
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue({});
    certificadoRepo.findByInscricao.mockResolvedValue(null);
    await expect(useCase.execute(userId, dto)).rejects.toThrow(ForbiddenException);
  });

  it('deve lançar BadRequest se já existir avaliação', async () => {
    usuarioRepo.findById.mockResolvedValue({ tipo: 'aluno' });
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue({});
    certificadoRepo.findByInscricao.mockResolvedValue({});
    avaliacaoRepo.findByUserAndCourse.mockResolvedValue({});
    await expect(useCase.execute(userId, dto)).rejects.toThrow(BadRequestException);
  });

  it('deve lançar BadRequest se curso não encontrado', async () => {
    usuarioRepo.findById.mockResolvedValue({ tipo: 'aluno' });
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue({});
    certificadoRepo.findByInscricao.mockResolvedValue({});
    avaliacaoRepo.findByUserAndCourse.mockResolvedValue(null);
    cursoRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(userId, dto)).rejects.toThrow(BadRequestException);
  });

  it('deve criar avaliação, atualizar média e retornar modelo', async () => {
    usuarioRepo.findById.mockResolvedValue({ tipo: 'aluno' });
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue({});
    certificadoRepo.findByInscricao.mockResolvedValue({});
    avaliacaoRepo.findByUserAndCourse.mockResolvedValue(null);
    cursoRepo.findById.mockResolvedValue({ id: cursoId });

    avaliacaoRepo.create.mockResolvedValue({ id: 1 });
    avaliacaoRepo.getCourseAverage.mockResolvedValue(4.5);
    avaliacaoRepo.toModel.mockReturnValue({ id: 1 });

    const result = await useCase.execute(userId, dto);

    expect(avaliacaoRepo.create).toHaveBeenCalled();
    expect(avaliacaoRepo.getCourseAverage).toHaveBeenCalledWith(cursoId);
    expect(cursoRepo.update).toHaveBeenCalledWith(cursoId, { avaliacao: 4.5 });
    expect(result).toEqual({ id: 1 });
  });
});
