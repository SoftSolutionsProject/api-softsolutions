import { NotFoundException } from '@nestjs/common';
import { ListarInscricoesUseCase } from './listar-inscricoes.use-case';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';

describe('ListarInscricoesUseCase', () => {
  let useCase: ListarInscricoesUseCase;
  let inscricaoRepo: jest.Mocked<InscricaoRepository>;
  let usuarioRepo: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    inscricaoRepo = {
      findByUsuario: jest.fn(),
    } as any;

    usuarioRepo = {
      findById: jest.fn(),
    } as any;

    useCase = new ListarInscricoesUseCase(inscricaoRepo, usuarioRepo);
  });

  it('deve listar inscrições do usuário', async () => {
    const inscricoes = [{ id: 1 }, { id: 2 }];
    usuarioRepo.findById.mockResolvedValue({ id: 1 } as any);
    inscricaoRepo.findByUsuario.mockResolvedValue(inscricoes as any);

    await expect(useCase.execute(1)).resolves.toEqual(inscricoes);
    expect(inscricaoRepo.findByUsuario).toHaveBeenCalledWith(1);
  });

  it('deve retornar lista vazia se não houver inscrições', async () => {
    usuarioRepo.findById.mockResolvedValue({ id: 1 } as any);
    inscricaoRepo.findByUsuario.mockResolvedValue([]);

    await expect(useCase.execute(1)).resolves.toEqual([]);
  });

  it('deve lançar erro quando o usuário não existir', async () => {
    usuarioRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
    expect(inscricaoRepo.findByUsuario).not.toHaveBeenCalled();
  });
});
