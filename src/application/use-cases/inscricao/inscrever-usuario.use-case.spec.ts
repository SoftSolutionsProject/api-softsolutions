import { InscreverUsuarioUseCase } from './inscrever-usuario.use-case';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { ProgressoAulaRepository } from '../../../infrastructure/database/repositories/progresso-aula.repository';
import { AulaRepository } from '../../../infrastructure/database/repositories/aula.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('InscreverUsuarioUseCase', () => {
  let useCase: InscreverUsuarioUseCase;
  let usuarioRepo: jest.Mocked<UsuarioRepository>;
  let cursoRepo: jest.Mocked<CursoRepository>;
  let inscricaoRepo: jest.Mocked<InscricaoRepository>;
  let progressoRepo: jest.Mocked<ProgressoAulaRepository>;
  let aulaRepo: jest.Mocked<AulaRepository>;

  const usuarioMock = {
    id: 1,
    nomeUsuario: 'João',
    cpfUsuario: '12345678900',
    email: 'joao@email.com',
    senha: 'senha123',
    tipo: 'aluno',
  } as const;

  const cursoMock = {
    id: 1,
    nomeCurso: 'Curso Teste',
    modulos: [
      {
        aulas: [
          { id: 1, nomeAula: 'Aula 1' },
          { id: 2, nomeAula: 'Aula 2' },
        ],
      },
    ],
  };

  const inscricaoMock = {
    id: 1,
    status: 'ativo' as const,
    dataInscricao: new Date('2026-04-29T00:00:00.000Z'),
    usuario: usuarioMock,
    curso: cursoMock,
  };

  beforeEach(() => {
    usuarioRepo = { findById: jest.fn() } as any;
    cursoRepo = { findByIdWithModulosAndAulas: jest.fn() } as any;
    inscricaoRepo = {
      findByUsuarioAndCurso: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as any;
    progressoRepo = {
      createMany: jest.fn(),
    } as any;
    aulaRepo = {} as any;

    useCase = new InscreverUsuarioUseCase(
      usuarioRepo,
      cursoRepo,
      inscricaoRepo,
      progressoRepo,
      aulaRepo,
    );
  });

  it('deve inscrever o usuário com sucesso e criar progresso para as aulas', async () => {
    usuarioRepo.findById.mockResolvedValue(usuarioMock as any);
    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(cursoMock as any);
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue(null);
    inscricaoRepo.create.mockResolvedValue(inscricaoMock as any);

    const result = await useCase.execute(1, 1);

    expect(result).toHaveProperty('id');
    expect(inscricaoRepo.create).toHaveBeenCalledWith({
      usuario: usuarioMock,
      curso: cursoMock,
      status: 'ativo',
    });
    expect(progressoRepo.createMany).toHaveBeenCalledWith([
      expect.objectContaining({ aula: cursoMock.modulos[0].aulas[0], concluida: false }),
      expect.objectContaining({ aula: cursoMock.modulos[0].aulas[1], concluida: false }),
    ]);
  });

  it('deve reativar inscrição cancelada', async () => {
    usuarioRepo.findById.mockResolvedValue(usuarioMock as any);
    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(cursoMock as any);
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue({
      ...inscricaoMock,
      status: 'cancelado',
    } as any);
    inscricaoRepo.update.mockResolvedValue(inscricaoMock as any);

    await useCase.execute(1, 1);

    expect(inscricaoRepo.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        status: 'ativo',
        dataInscricao: expect.any(Date),
      }),
    );
    expect(progressoRepo.createMany).not.toHaveBeenCalled();
  });

  it('deve lançar erro se inscrição já existir e estiver ativa', async () => {
    usuarioRepo.findById.mockResolvedValue(usuarioMock as any);
    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(cursoMock as any);
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue(inscricaoMock as any);

    await expect(useCase.execute(1, 1)).rejects.toThrow(BadRequestException);
  });

  it('deve lançar NotFoundException se curso não for encontrado', async () => {
    usuarioRepo.findById.mockResolvedValue(usuarioMock as any);
    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(null);

    await expect(useCase.execute(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('deve lançar NotFoundException se usuário não for encontrado', async () => {
    usuarioRepo.findById.mockResolvedValue(null);
    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(cursoMock as any);

    await expect(useCase.execute(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('deve não criar progresso quando o curso não tiver aulas', async () => {
    const cursoSemAulas = {
      ...cursoMock,
      modulos: [],
    };
    usuarioRepo.findById.mockResolvedValue(usuarioMock as any);
    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(cursoSemAulas as any);
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue(null);
    inscricaoRepo.create.mockResolvedValue({
      ...inscricaoMock,
      curso: cursoSemAulas,
    } as any);

    await useCase.execute(1, 1);

    expect(progressoRepo.createMany).not.toHaveBeenCalled();
  });

  it('deve não criar progresso quando houver módulos sem lista de aulas', async () => {
    const cursoComModuloSemAulas = {
      ...cursoMock,
      modulos: [{ aulas: undefined }],
    };
    usuarioRepo.findById.mockResolvedValue(usuarioMock as any);
    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(
      cursoComModuloSemAulas as any,
    );
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue(null);
    inscricaoRepo.create.mockResolvedValue({
      ...inscricaoMock,
      curso: cursoComModuloSemAulas,
    } as any);

    await useCase.execute(1, 1);

    expect(progressoRepo.createMany).not.toHaveBeenCalled();
  });
});
