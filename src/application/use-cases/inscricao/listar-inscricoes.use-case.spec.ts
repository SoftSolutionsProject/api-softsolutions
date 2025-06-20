import { ListarInscricoesUseCase } from './listar-inscricoes.use-case';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';

describe('ListarInscricoesUseCase', () => {
  let useCase: ListarInscricoesUseCase;
  let inscricaoRepo: jest.Mocked<InscricaoRepository>;
  let usuarioRepo: jest.Mocked<UsuarioRepository>;

  const inscricaoMock = {
    id: 1,
    status: 'ativo' as const,
    dataInscricao: new Date(),
    usuario: {
      id: 1,
      nomeUsuario: 'João',
      cpfUsuario: '12345678900',
      email: 'joao@email.com',
      senha: 'senha123',
      tipo: 'aluno'
    },
    curso: {
      id: 1,
      nomeCurso: 'Curso Teste',
      tempoCurso: 120,
      descricaoCurta: 'Descrição curta',
      descricaoDetalhada: 'Descrição detalhada',
      imagemCurso: 'imagem.jpg',
      categoria: 'Categoria Teste',
      status: 'ativo' as const,
      professor: 'Professor Teste',
      avaliacao: 4.5,
      modulos: []
    }
  };

  beforeEach(() => {
    inscricaoRepo = {
      findByUsuario: jest.fn()
    } as any;

    usuarioRepo = {
      findById: jest.fn()
    } as any;

    useCase = new ListarInscricoesUseCase(inscricaoRepo, usuarioRepo);
  });

  it('deve listar inscrições do usuário', async () => {
    usuarioRepo.findById.mockResolvedValue({ id: 1 } as any);
    inscricaoRepo.findByUsuario.mockResolvedValue([inscricaoMock as any]);

    const result = await useCase.execute(1);

    expect(Array.isArray(result)).toBe(true);
    expect(usuarioRepo.findById).toHaveBeenCalledWith(1);
    expect(inscricaoRepo.findByUsuario).toHaveBeenCalledWith(1);
  });

  it('deve retornar lista vazia se não houver inscrições', async () => {
    usuarioRepo.findById.mockResolvedValue({ id: 1 } as any);
    inscricaoRepo.findByUsuario.mockResolvedValue([]);

    const result = await useCase.execute(1);

    expect(result).toEqual([]);
    expect(usuarioRepo.findById).toHaveBeenCalledWith(1);
    expect(inscricaoRepo.findByUsuario).toHaveBeenCalledWith(1);
  });
});
