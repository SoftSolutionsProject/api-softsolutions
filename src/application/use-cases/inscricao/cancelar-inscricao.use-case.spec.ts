import { CancelarInscricaoUseCase } from './cancelar-inscricao.use-case';
import { NotFoundException } from '@nestjs/common';

describe('CancelarInscricaoUseCase', () => {
  let useCase: CancelarInscricaoUseCase;
  let inscricaoRepo: {
    findById: jest.Mock;
    update: jest.Mock;
  };

  beforeEach(() => {
    inscricaoRepo = {
      findById: jest.fn(),
      update: jest.fn(),
    };
    useCase = new CancelarInscricaoUseCase(inscricaoRepo as any);
  });

  it('deve cancelar inscrição se encontrada e pertence ao usuário', async () => {
    const inscricaoMock = {
      id: 1,
      usuario: { id: 1 },
    };
    inscricaoRepo.findById.mockResolvedValue(inscricaoMock);
    inscricaoRepo.update.mockResolvedValue({ message: 'Inscrição cancelada com sucesso' });

    const result = await useCase.execute(1, 1);

    expect(inscricaoRepo.findById).toHaveBeenCalledWith(1);
    expect(inscricaoRepo.update).toHaveBeenCalledWith(1, { status: 'cancelado' });
    expect(result).toEqual({ message: 'Inscrição cancelada com sucesso' });
  });

  it('deve permitir cancelamento se admin', async () => {
    const inscricaoMock = {
      id: 1,
      usuario: { id: 999 },
    };
    inscricaoRepo.findById.mockResolvedValue(inscricaoMock);

    const result = await useCase.execute(1, 1, true);

    expect(inscricaoRepo.findById).toHaveBeenCalledWith(1);
    expect(inscricaoRepo.update).toHaveBeenCalledWith(1, { status: 'cancelado' });
    expect(result).toHaveProperty('message');
  });

  it('deve lançar NotFoundException se inscrição não encontrada', async () => {
    inscricaoRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, 1)).rejects.toThrow(NotFoundException);
  });

  it('deve lançar NotFoundException se inscrição não pertence ao usuário', async () => {
    const inscricaoMock = {
      id: 1,
      usuario: { id: 999 },
    };
    inscricaoRepo.findById.mockResolvedValue(inscricaoMock);

    await expect(useCase.execute(1, 1)).rejects.toThrow(NotFoundException);
  });
});
