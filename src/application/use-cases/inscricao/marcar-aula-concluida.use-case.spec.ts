import { MarcarAulaConcluidaUseCase } from './marcar-aula-concluida.use-case';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { AulaRepository } from '../../../infrastructure/database/repositories/aula.repository';
import { ProgressoAulaRepository } from '../../../infrastructure/database/repositories/progresso-aula.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MarcarAulaConcluidaUseCase', () => {
  let useCase: MarcarAulaConcluidaUseCase;
  let inscricaoRepo: jest.Mocked<InscricaoRepository>;
  let aulaRepo: jest.Mocked<AulaRepository>;
  let progressoRepo: jest.Mocked<ProgressoAulaRepository>;

  beforeEach(() => {
    inscricaoRepo = { findById: jest.fn() } as any;
    aulaRepo = { findByIdWithModuloAndCurso: jest.fn() } as any;
    progressoRepo = { findByInscricaoAndAula: jest.fn(), update: jest.fn() } as any;

    useCase = new MarcarAulaConcluidaUseCase(inscricaoRepo, progressoRepo, aulaRepo);
  });

  it('deve marcar aula como concluída', async () => {
    const inscricaoMock = { id: 1, usuario: { id: 1 }, curso: { id: 1 } } as any;
    const aulaMock = { id: 1, modulo: { curso: { id: 1 } } } as any;
    const progressoMock = { id: 1, concluida: false, dataConclusao: undefined } as any;

    inscricaoRepo.findById.mockResolvedValue(inscricaoMock);
    aulaRepo.findByIdWithModuloAndCurso.mockResolvedValue(aulaMock);
    progressoRepo.findByInscricaoAndAula.mockResolvedValue(progressoMock);
    progressoRepo.update.mockResolvedValue({ ...progressoMock, concluida: true, dataConclusao: new Date() });

    const result = await useCase.execute(1, 1, 1);

    expect(inscricaoRepo.findById).toHaveBeenCalledWith(1);
    expect(aulaRepo.findByIdWithModuloAndCurso).toHaveBeenCalledWith(1);
    expect(progressoRepo.findByInscricaoAndAula).toHaveBeenCalledWith(1, 1);
    expect(progressoRepo.update).toHaveBeenCalledWith(1, expect.objectContaining({ concluida: true }));
    expect(result.concluida).toBe(true);
    expect(result.dataConclusao).toBeInstanceOf(Date);
  });

  it('deve lançar erro se inscrição não existir ou não pertencer ao usuário', async () => {
    inscricaoRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, 1, 1)).rejects.toThrow(NotFoundException);
  });

  it('deve lançar erro se aula não pertencer ao curso', async () => {
    const inscricaoMock = { id: 1, usuario: { id: 1 }, curso: { id: 1 } } as any;
    const aulaMock = { id: 1, modulo: { curso: { id: 999 } } } as any;

    inscricaoRepo.findById.mockResolvedValue(inscricaoMock);
    aulaRepo.findByIdWithModuloAndCurso.mockResolvedValue(aulaMock);

    await expect(useCase.execute(1, 1, 1)).rejects.toThrow(BadRequestException);
  });

  it('deve lançar erro se progresso não existir', async () => {
    const inscricaoMock = { id: 1, usuario: { id: 1 }, curso: { id: 1 } } as any;
    const aulaMock = { id: 1, modulo: { curso: { id: 1 } } } as any;

    inscricaoRepo.findById.mockResolvedValue(inscricaoMock);
    aulaRepo.findByIdWithModuloAndCurso.mockResolvedValue(aulaMock);
    progressoRepo.findByInscricaoAndAula.mockResolvedValue(null);

    await expect(useCase.execute(1, 1, 1)).rejects.toThrow(NotFoundException);
  });
});
