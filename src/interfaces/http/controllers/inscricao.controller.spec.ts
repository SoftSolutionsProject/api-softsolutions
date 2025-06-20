import { Test, TestingModule } from '@nestjs/testing';
import { InscricaoController } from './inscricao.controller';
import { InscreverUsuarioUseCase } from '../../../application/use-cases/inscricao/inscrever-usuario.use-case';
import { ListarInscricoesUseCase } from '../../../application/use-cases/inscricao/listar-inscricoes.use-case';
import { MarcarAulaConcluidaUseCase } from '../../../application/use-cases/inscricao/marcar-aula-concluida.use-case';
import { CancelarInscricaoUseCase } from '../../../application/use-cases/inscricao/cancelar-inscricao.use-case';
import { VerProgressoUseCase } from '../../../application/use-cases/inscricao/ver-progresso.use-case';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { DesmarcarAulaConcluidaUseCase } from '../../../application/use-cases/inscricao/desmarcar-aula-concluida.use-case';

describe('InscricaoController', () => {
  let controller: InscricaoController;
  let verProgresso: jest.Mocked<VerProgressoUseCase>;

  beforeEach(async () => {
    // Mock para todos os providers necessários
    const inscreverUsuario = { execute: jest.fn() };
    const listarInscricoes = { execute: jest.fn() };
    const marcarAulaConcluida = { execute: jest.fn() };
    const cancelarInscricao = { execute: jest.fn() };
    verProgresso = { execute: jest.fn() } as any;
    const inscricaoRepo = {};
    const cursoRepo = {};
    const desmarcarAulaConcluida = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InscricaoController],
      providers: [
        { provide: InscreverUsuarioUseCase, useValue: inscreverUsuario },
        { provide: ListarInscricoesUseCase, useValue: listarInscricoes },
        { provide: MarcarAulaConcluidaUseCase, useValue: marcarAulaConcluida },
        { provide: CancelarInscricaoUseCase, useValue: cancelarInscricao },
        { provide: VerProgressoUseCase, useValue: verProgresso },
        { provide: InscricaoRepository, useValue: inscricaoRepo },
        { provide: CursoRepository, useValue: cursoRepo },
        { provide: DesmarcarAulaConcluidaUseCase, useValue: desmarcarAulaConcluida },
      ],
    }).compile();

    controller = module.get<InscricaoController>(InscricaoController);
  });

  it('deve ver progresso corretamente', async () => {
    verProgresso.execute.mockResolvedValue({
      progresso: 75,
      aulasConcluidas: 3,
      totalAulas: 4,
    });

    const result = await controller.progresso(1, 1);

    expect(verProgresso.execute).toHaveBeenCalledWith(1, 1);
    expect(result).toEqual({
      progresso: 75,
      aulasConcluidas: 3,
      totalAulas: 4,
    });
  });
});
