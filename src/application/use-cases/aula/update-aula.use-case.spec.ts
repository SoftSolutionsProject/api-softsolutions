import { UpdateAulaUseCase } from './update-aula.use-case';
import { AulaRepository } from '../../../infrastructure/database/repositories/aula.repository';
import { NotFoundException } from '@nestjs/common';

describe('UpdateAulaUseCase', () => {
  let useCase: UpdateAulaUseCase;
  let aulaRepo: jest.Mocked<AulaRepository>;

  beforeEach(() => {
    aulaRepo = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    useCase = new UpdateAulaUseCase(aulaRepo);
  });

  it('deve lançar exceção se a aula não existir', async () => {
    aulaRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, {})).rejects.toThrow(NotFoundException);
  });

  it('deve atualizar e retornar a aula', async () => {
    const aulaExistente = {
      id: 1,
      nomeAula: 'Aula Antiga',
      tempoAula: 30,
      videoUrl: 'url_antiga',
      descricaoConteudo: 'desc_antiga',
      materialApoio: [],
      modulo: {
        id: 1,
        nomeModulo: 'Modulo 1',
        tempoModulo: 100,
        curso: { id: 1, nomeCurso: 'Curso 1' },
      },
    };

    const dto = {
      nomeAula: 'Aula Atualizada',
    };

    aulaRepo.findById.mockResolvedValue(aulaExistente);
    aulaRepo.update.mockResolvedValue({ ...aulaExistente, ...dto });

    const result = await useCase.execute(1, dto);

    expect(result.nomeAula).toBe('Aula Atualizada');
    expect(aulaRepo.update).toHaveBeenCalledWith(1, expect.objectContaining(dto));
  });
});
