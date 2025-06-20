import { DesmarcarAulaConcluidaUseCase } from './desmarcar-aula-concluida.use-case';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DesmarcarAulaConcluidaUseCase', () => {
  let useCase: DesmarcarAulaConcluidaUseCase;
  let inscricaoRepo: any;
  let progressoRepo: any;
  let aulaRepo: any;
  let certificadoRepo: any;

  beforeEach(() => {
    inscricaoRepo = { findById: jest.fn() };
    progressoRepo = { findByInscricaoAndAula: jest.fn(), update: jest.fn() };
    aulaRepo = { findByIdWithModuloAndCurso: jest.fn() };
    certificadoRepo = { findByInscricao: jest.fn() };

    useCase = new DesmarcarAulaConcluidaUseCase(
      inscricaoRepo,
      progressoRepo,
      aulaRepo,
      certificadoRepo
    );
  });

  it('deve desmarcar aula como concluída', async () => {
    const inscricao = { id: 1, usuario: { id: 1 }, curso: { id: 1 } };
    const aula = { id: 1, modulo: { curso: { id: 1 } } };
    const progresso = { id: 1, concluida: true, dataConclusao: new Date() };

    inscricaoRepo.findById.mockResolvedValue(inscricao);
    certificadoRepo.findByInscricao.mockResolvedValue(null);
    aulaRepo.findByIdWithModuloAndCurso.mockResolvedValue(aula);
    progressoRepo.findByInscricaoAndAula.mockResolvedValue(progresso);
    progressoRepo.update.mockResolvedValue({ ...progresso, concluida: false, dataConclusao: undefined });

    const result = await useCase.execute(1, 1, 1);

    expect(progressoRepo.update).toHaveBeenCalledWith(progresso.id, {
      ...progresso,
      concluida: false,
      dataConclusao: undefined,
    });
    expect(result).toHaveProperty('id');
  });

  it('deve lançar NotFoundException se inscrição não for do usuário', async () => {
    inscricaoRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, 1, 1)).rejects.toThrow(NotFoundException);
  });

  it('deve lançar BadRequestException se certificado existir', async () => {
    const inscricao = { id: 1, usuario: { id: 1 }, curso: { id: 1 } };
    inscricaoRepo.findById.mockResolvedValue(inscricao);
    certificadoRepo.findByInscricao.mockResolvedValue({ id: 1 });

    await expect(useCase.execute(1, 1, 1)).rejects.toThrow(BadRequestException);
  });

  it('deve lançar BadRequestException se aula não pertence ao curso', async () => {
    const inscricao = { id: 1, usuario: { id: 1 }, curso: { id: 1 } };
    inscricaoRepo.findById.mockResolvedValue(inscricao);
    certificadoRepo.findByInscricao.mockResolvedValue(null);
    aulaRepo.findByIdWithModuloAndCurso.mockResolvedValue(null);

    await expect(useCase.execute(1, 1, 1)).rejects.toThrow(BadRequestException);
  });

  it('deve lançar NotFoundException se progresso não encontrado', async () => {
    const inscricao = { id: 1, usuario: { id: 1 }, curso: { id: 1 } };
    const aula = { id: 1, modulo: { curso: { id: 1 } } };

    inscricaoRepo.findById.mockResolvedValue(inscricao);
    certificadoRepo.findByInscricao.mockResolvedValue(null);
    aulaRepo.findByIdWithModuloAndCurso.mockResolvedValue(aula);
    progressoRepo.findByInscricaoAndAula.mockResolvedValue(null);

    await expect(useCase.execute(1, 1, 1)).rejects.toThrow(NotFoundException);
  });
});
