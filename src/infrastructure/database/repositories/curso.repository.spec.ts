import { Test, TestingModule } from '@nestjs/testing';
import { CursoRepository } from './curso.repository';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CursoEntity } from '../entities/curso.entity';

const mockCurso = {
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
  ],
};

describe('CursoRepository', () => {
  let repository: CursoRepository;
  let repo: Repository<CursoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CursoRepository,
        {
          provide: getRepositoryToken(CursoEntity),
          useValue: {
            create: jest.fn().mockReturnValue(mockCurso),
            save: jest.fn().mockResolvedValue(mockCurso),
            findOne: jest.fn().mockResolvedValue(mockCurso),
            find: jest.fn().mockResolvedValue([mockCurso]),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    repository = module.get<CursoRepository>(CursoRepository);
    repo = module.get<Repository<CursoEntity>>(getRepositoryToken(CursoEntity));
  });

  it('deve criar um curso', async () => {
    const result = await repository.create(mockCurso);
    expect(repo.create).toHaveBeenCalledWith(mockCurso);
    expect(repo.save).toHaveBeenCalledWith(mockCurso);
    expect(result).toEqual(mockCurso);
  });

  it('deve buscar por id', async () => {
    const result = await repository.findById(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['modulos', 'modulos.aulas'] });
    expect(result).toEqual(mockCurso);
  });

  it('deve buscar todos', async () => {
    const result = await repository.findAll();
    expect(repo.find).toHaveBeenCalled();
    expect(result).toEqual([mockCurso]);
  });

  it('deve atualizar um curso', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(mockCurso as any);
    const result = await repository.update(1, { nomeCurso: 'Novo Curso' });
    expect(repo.update).toHaveBeenCalledWith(1, { nomeCurso: 'Novo Curso' });
    expect(result).toEqual(mockCurso);
  });

  it('deve deletar um curso', async () => {
    await repository.delete(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('deve buscar por id com módulos e aulas', async () => {
    const result = await repository.findByIdWithModulosAndAulas(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['modulos', 'modulos.aulas'] });
    expect(result).toEqual(mockCurso);
  });
});
