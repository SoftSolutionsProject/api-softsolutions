import { Test, TestingModule } from '@nestjs/testing';
import { InscricaoRepository } from './inscricao.repository';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InscricaoEntity } from '../entities/inscricao.entity';

let mockInscricao: any = {};
mockInscricao = {
  id: 1,
  usuario: { id: 1, nomeUsuario: 'Usuário', nome: 'Usuário', email: 'a@a.com', senha: '123', cpfUsuario: '123', tipo: 'aluno' as 'aluno', status: 'ativo' as 'ativo', dataNascimento: '', telefone: '', fotoPerfil: '', createdAt: '', updatedAt: '' },
  curso: {
    id: 1,
    nomeCurso: 'Curso Teste',
    tempoCurso: 10,
    descricaoCurta: 'desc curta',
    descricaoDetalhada: 'desc detalhada',
    professor: 'prof',
    categoria: 'cat',
    status: 'ativo' as 'ativo',
    avaliacao: 5,
    imagemCurso: 'img.png',
    modulos: [
      {
        id: 1,
        nomeModulo: 'Modulo Teste',
        tempoModulo: 5,
        curso: undefined,
        aulas: []
      }
    ].slice(),
  },
  progressoAulas: [
    {
      id: 1,
      aula: { id: 1, nomeAula: 'Aula', tempoAula: 10, videoUrl: '', descricaoConteudo: '', modulo: undefined },
      inscricao: undefined as any, // será sobrescrito abaixo
      concluida: false
    }
  ].slice(),
};
// Corrige referência circular após definição
mockInscricao.progressoAulas[0].inscricao = mockInscricao;

describe('InscricaoRepository', () => {
  let repository: InscricaoRepository;
  let repo: Repository<InscricaoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InscricaoRepository,
        {
          provide: getRepositoryToken(InscricaoEntity),
          useValue: {
            create: jest.fn().mockReturnValue(mockInscricao),
            save: jest.fn().mockResolvedValue(mockInscricao),
            findOne: jest.fn().mockResolvedValue(mockInscricao),
            find: jest.fn().mockResolvedValue([mockInscricao]),
            update: jest.fn().mockResolvedValue(undefined),
            count: jest.fn().mockResolvedValue(5),
          },
        },
      ],
    }).compile();

    repository = module.get<InscricaoRepository>(InscricaoRepository);
    repo = module.get<Repository<InscricaoEntity>>(getRepositoryToken(InscricaoEntity));
  });

  it('deve criar uma inscrição', async () => {
    const result = await repository.create(mockInscricao);
    expect(repo.create).toHaveBeenCalledWith(mockInscricao);
    expect(repo.save).toHaveBeenCalledWith(mockInscricao);
    expect(result).toEqual(mockInscricao);
  });

  it('deve buscar por id', async () => {
    const result = await repository.findById(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: [
      'usuario', 'curso', 'curso.modulos', 'curso.modulos.aulas', 'progressoAulas', 'progressoAulas.aula'] });
    expect(result).toEqual(mockInscricao);
  });

  it('deve buscar por usuario e curso', async () => {
    const result = await repository.findByUsuarioAndCurso(1, 1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { usuario: { id: 1 }, curso: { id: 1 } }, relations: ['usuario', 'curso'] });
    expect(result).toEqual(mockInscricao);
  });

  it('deve buscar por usuario', async () => {
    const result = await repository.findByUsuario(1);
    expect(repo.find).toHaveBeenCalledWith({ where: { usuario: { id: 1 } }, relations: ['curso', 'progressoAulas', 'progressoAulas.aula'] });
    expect(result).toEqual([mockInscricao]);
  });

  it('deve atualizar uma inscrição', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(mockInscricao as any);
    const result = await repository.update(1, { status: 'ativo' });
    expect(repo.update).toHaveBeenCalledWith(1, { status: 'ativo' });
    expect(result).toEqual(mockInscricao);
  });

  it('deve fazer simpleUpdate', async () => {
    await repository.simpleUpdate(1, { status: 'cancelado' });
    expect(repo.update).toHaveBeenCalledWith(1, { status: 'cancelado' });
  });

  it('deve contar inscrições por curso', async () => {
    const result = await repository.countByCurso(1);
    expect(repo.count).toHaveBeenCalledWith({ where: { curso: { id: 1 }, status: 'ativo' } });
    expect(result).toBe(5);
  });
});
