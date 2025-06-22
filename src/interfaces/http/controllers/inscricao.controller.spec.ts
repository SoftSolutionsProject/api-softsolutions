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

  const usuarioMock = {
    id: 1,
    nomeUsuario: 'Teste',
    cpfUsuario: '00000000000',
    email: 'teste@email.com',
    senha: '123456',
    tipo: 'aluno' as 'aluno',
  };

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
    usuario: usuarioMock,
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
    modulo: {
      id: 1,
      nomeModulo: 'Modulo',
      tempoModulo: 60,
      curso: cursoMock, // cursoMock já está 100% correto
    },
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
    inscreverUsuario.execute.mockResolvedValue(inscricaoMock);
    const result = await controller.inscrever(1, 1);
    expect(result).toHaveProperty('id');
  });

  it('deve listar inscrições', async () => {
    listarInscricoes.execute.mockResolvedValue([inscricaoMock]);
    const result = await controller.listar(1);
    expect(result[0]).toHaveProperty('id');
  });

  it('deve ver progresso', async () => {
    verProgresso.execute.mockResolvedValue({
      progresso: 50,
      aulasConcluidas: 5,
      totalAulas: 10,
    });
    const result = await controller.progresso(1, 1);
    expect(result).toHaveProperty('progresso');
  });

  it('deve cancelar inscrição', async () => {
    cancelarInscricao.execute.mockResolvedValue({ message: 'OK' });
    const result = await controller.cancelar(1, 1, 'administrador');
    expect(result).toHaveProperty('message');
  });

  it('deve marcar aula como concluída', async () => {
    marcarAulaConcluida.execute.mockResolvedValue(progressoMock);
    const result = await controller.concluirAula(1, 1, 1);
    expect(result).toHaveProperty('id');
  });

  it('deve desmarcar aula como concluída', async () => {
    desmarcarAulaConcluida.execute.mockResolvedValue(progressoMock);
    const result = await controller.desmarcarAula(1, 1, 1);
    expect(result).toHaveProperty('id');
  });

  it('deve obter módulos e aulas se inscrito', async () => {
    cursoRepo.findByIdWithModulosAndAulas.mockResolvedValue(cursoMock);
    inscricaoRepo.findByUsuarioAndCurso.mockResolvedValue(inscricaoMock);
    const result = await controller.getModulosEAulas('1', 1);
    expect(Array.isArray(result)).toBe(true);
  });
});
