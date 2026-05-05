import { Test, TestingModule } from '@nestjs/testing';
import { ModuloRepository } from './modulo.repository';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ModuloEntity } from '../entities/modulo.entity';

const mockModulo = {
  id: 1,
  nomeModulo: 'Modulo Teste',
  tempoModulo: 5,
  curso: { id: 1, nomeCurso: 'Curso Teste', tempoCurso: 10, descricaoCurta: '', descricaoDetalhada: '', professor: '', categoria: '', status: 'ativo', avaliacao: 5, imagemCurso: '', modulos: [] },
  aulas: [],
};

describe('ModuloRepository', () => {
  let repository: ModuloRepository;
  let repo: Repository<ModuloEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModuloRepository,
        {
          provide: getRepositoryToken(ModuloEntity),
          useValue: {
            create: jest.fn().mockReturnValue(mockModulo),
            save: jest.fn().mockResolvedValue(mockModulo),
            findOne: jest.fn().mockResolvedValue(mockModulo),
            find: jest.fn().mockResolvedValue([mockModulo]),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    repository = module.get<ModuloRepository>(ModuloRepository);
    repo = module.get<Repository<ModuloEntity>>(getRepositoryToken(ModuloEntity));
  });

  it('deve criar um módulo', async () => {
    const result = await repository.create(mockModulo);
    expect(repo.create).toHaveBeenCalledWith(mockModulo);
    expect(repo.save).toHaveBeenCalledWith(mockModulo);
    expect(result).toEqual(mockModulo);
  });

  it('deve buscar por id', async () => {
    const result = await repository.findById(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['curso'] });
    expect(result).toEqual(mockModulo);
  });

  it('deve buscar todos', async () => {
    const result = await repository.findAll();
    expect(repo.find).toHaveBeenCalledWith({ relations: ['curso'] });
    expect(result).toEqual([mockModulo]);
  });

  it('deve atualizar um módulo', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(mockModulo as any);
    const result = await repository.update(1, { nomeModulo: 'Novo Modulo' });
    expect(repo.update).toHaveBeenCalledWith(1, { nomeModulo: 'Novo Modulo' });
    expect(result).toEqual(mockModulo);
  });

  it('deve deletar um módulo', async () => {
    await repository.delete(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });
});
