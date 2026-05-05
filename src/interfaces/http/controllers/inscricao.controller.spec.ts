import { Test, TestingModule } from '@nestjs/testing';
import { InscricaoController } from './inscricao.controller';
import { InscreverUsuarioUseCase } from '../../../application/use-cases/inscricao/inscrever-usuario.use-case';
import { ListarInscricoesUseCase } from '../../../application/use-cases/inscricao/listar-inscricoes.use-case';
import { MarcarAulaConcluidaUseCase } from '../../../application/use-cases/inscricao/marcar-aula-concluida.use-case';
import { CancelarInscricaoUseCase } from '../../../application/use-cases/inscricao/cancelar-inscricao.use-case';
import { VerProgressoUseCase } from '../../../application/use-cases/inscricao/ver-progresso.use-case';
import { DesmarcarAulaConcluidaUseCase } from '../../../application/use-cases/inscricao/desmarcar-aula-concluida.use-case';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('InscricaoController', () => {
  let controller: InscricaoController;
  let inscreverUsuario: jest.Mocked<InscreverUsuarioUseCase>;
  let listarInscricoes: jest.Mocked<ListarInscricoesUseCase>;
  let marcarAulaConcluida: jest.Mocked<MarcarAulaConcluidaUseCase>;
  let cancelarInscricao: jest.Mocked<CancelarInscricaoUseCase>;
  let verProgresso: jest.Mocked<VerProgressoUseCase>;
  let desmarcarAulaConcluida: jest.Mocked<DesmarcarAulaConcluidaUseCase>;
  let inscricaoRepo: jest.Mocked<InscricaoRepository>;
  let cursoRepo: jest.Mocked<CursoRepository>;

  const cursoMock = {
    id: 1,
    nomeCurso: 'Curso Teste',
    tempoCurso: 40,
    descricaoCurta: 'Desc curta',
    descricaoDetalhada: 'Desc detalhada',
    professor: 'Prof X',
    categoria: 'Categoria Y',
    status: 'ativo' as 'ativo',
    avaliacao: 5,
    imagemCurso: 'url',
    modulos: [],
  };

  const inscricaoMock = {
    id: 1,
    curso: cursoMock,
    dataInscricao: new Date(),
    status: 'ativo' as 'ativo',
  };

  const progressoMock = {
    id: 1,
    inscricao: inscricaoMock,
    aula: {
      id: 1,
      nomeAula: 'Aula',
      tempoAula: 30,
      videoUrl: 'url',
      descricaoConteudo: 'conteudo',
      modulo: { id: 1, nomeModulo: 'Modulo', tempoModulo: 60, curso: cursoMock },
    },
    concluida: true,
    dataConclusao: new Date(),
  };

  beforeEach(async () => {
    inscreverUsuario = { execute: jest.fn() } as any;
    listarInscricoes = { execute: jest.fn() } as any;
    marcarAulaConcluida = { execute: jest.fn() } as any;
    cancelarInscricao = { execute: jest.fn() } as any;
    verProgresso = { execute: jest.fn() } as any;
    desmarcarAulaConcluida = { execute: jest.fn() } as any;
    inscricaoRepo = { findByUsuarioAndCurso: jest.fn() } as any;
    cursoRepo = { findByIdWithModulosAndAulas: jest.fn() } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InscricaoController],
      providers: [
        { provide: InscreverUsuarioUseCase, useValue: inscreverUsuario },
        { provide: ListarInscricoesUseCase, useValue: listarInscricoes },
        { provide: MarcarAulaConcluidaUseCase, useValue: marcarAulaConcluida },
        { provide: CancelarInscricaoUseCase, useValue: cancelarInscricao },
        { provide: VerProgressoUseCase, useValue: verProgresso },
        { provide: DesmarcarAulaConcluidaUseCase, useValue: desmarcarAulaConcluida },
        { provide: InscricaoRepository, useValue: inscricaoRepo },
        { provide: CursoRepository, useValue: cursoRepo },
      ],
    }).compile();

    controller = module.get<InscricaoController>(InscricaoController);
  });

  it('deve inscrever usuário', async () => {
    inscreverUsuario.execute.mockResolvedValue(inscricaoMock as any);

    await expect(controller.inscrever(1, 1)).resolves.toHaveProperty('id');
    expect(inscreverUsuario.execute).toHaveBeenCalledWith(1, 1);
  });

  it('deve converter NotFound em NotFound e outros erros em BadRequest no fluxo de inscrição', async () => {
    inscreverUsuario.execute.mockRejectedValueOnce(
      new NotFoundException('Curso não encontrado'),
    );
    await expect(controller.inscrever(1, 1)).rejects.toThrow(NotFoundException);

    inscreverUsuario.execute.mockRejectedValueOnce(new Error('falhou'));
    await expect(controller.inscrever(1, 1)).rejects.toThrow(BadRequestException);
  });

  it('deve listar inscrições e ver progresso', async () => {
    listarInscricoes.execute.mockResolvedValue([inscricaoMock as any]);
    verProgresso.execute.mockResolvedValue({
      progresso: 50,
      aulasConcluidas: 5,
      totalAulas: 10,
    });

    await expect(controller.listar(1)).resolves.toHaveLength(1);
    await expect(controller.progresso(1, 1)).resolves.toHaveProperty('progresso');
  });

  it('deve cancelar inscrição usando id do usuário para aluno e id da inscrição para admin', async () => {
    cancelarInscricao.execute.mockResolvedValue({ message: 'OK' });

    await controller.cancelar(10, 2, 'aluno');
    expect(cancelarInscricao.execute).toHaveBeenCalledWith(2, 10, false);

    await controller.cancelar(10, 2, 'administrador');
    expect(cancelarInscricao.execute).toHaveBeenCalledWith(10, 10, true);
  });

  it('deve marcar e desmarcar aula concluída', async () => {
    marcarAulaConcluida.execute.mockResolvedValue(progressoMock as any);
    desmarcarAulaConcluida.execute.mockResolvedValue(progressoMock as any);

    await expect(controller.concluirAula(1, 1, 1)).resolves.toHaveProperty('id');
    await expect(controller.desmarcarAula(1, 1, 1)).resolves.toHaveProperty('id');
  });

  it('deve obter módulos e aulas se inscrito', async () => {
    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(cursoMock as any);
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue(inscricaoMock as any);

    await expect(controller.getModulosEAulas('1', 1)).resolves.toEqual([]);
  });

  it('deve validar id e curso no acesso aos módulos', async () => {
    await expect(controller.getModulosEAulas('abc', 1)).rejects.toThrow(
      ForbiddenException,
    );

    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(null);
    await expect(controller.getModulosEAulas('1', 1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve negar acesso aos módulos quando não houver inscrição ativa', async () => {
    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(cursoMock as any);
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue(null);
    await expect(controller.getModulosEAulas('1', 1)).rejects.toThrow(
      ForbiddenException,
    );

    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue({
      ...inscricaoMock,
      status: 'cancelado',
    } as any);
    await expect(controller.getModulosEAulas('1', 1)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
