import { Test, TestingModule } from '@nestjs/testing';
import { AulaRepository } from './aula.repository';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AulaEntity } from '../entities/aula.entity';

const mockAula = {
  id: 1,
  nomeAula: 'Aula Teste',
  tempoAula: 10,
  videoUrl: 'video.mp4',
  materialApoio: [],
  descricaoConteudo: 'desc',
  modulo: {
    id: 1,
    nomeModulo: 'Modulo Teste',
    tempoModulo: 5,
    curso: { id: 1, nomeCurso: 'Curso Teste', tempoCurso: 10, descricaoCurta: '', descricaoDetalhada: '', professor: '', categoria: '', status: 'ativo', avaliacao: 5, imagemCurso: '', modulos: [] },
    aulas: []
  }
};

describe('AulaRepository', () => {
  let repository: AulaRepository;
  let repo: Repository<AulaEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AulaRepository,
        {
          provide: getRepositoryToken(AulaEntity),
          useValue: {
            create: jest.fn().mockReturnValue(mockAula),
            save: jest.fn().mockResolvedValue(mockAula),
            findOne: jest.fn().mockResolvedValue(mockAula),
            find: jest.fn().mockResolvedValue([mockAula]),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    repository = module.get<AulaRepository>(AulaRepository);
    repo = module.get<Repository<AulaEntity>>(getRepositoryToken(AulaEntity));
  });

  it('deve criar uma aula', async () => {
    const result = await repository.create(mockAula);
    expect(repo.create).toHaveBeenCalledWith(mockAula);
    expect(repo.save).toHaveBeenCalledWith(mockAula);
    expect(result).toEqual(mockAula);
  });

  it('deve buscar por id', async () => {
    const result = await repository.findById(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['modulo'] });
    expect(result).toEqual(mockAula);
  });

  it('deve buscar todos', async () => {
    const result = await repository.findAll();
    expect(repo.find).toHaveBeenCalledWith({ relations: ['modulo'] });
    expect(result).toEqual([mockAula]);
  });

  it('deve atualizar uma aula', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(mockAula as any);
    const result = await repository.update(1, { nomeAula: 'Nova Aula' });
    expect(repo.update).toHaveBeenCalledWith(1, { nomeAula: 'Nova Aula' });
    expect(result).toEqual(mockAula);
  });

  it('deve deletar uma aula', async () => {
    await repository.delete(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('deve buscar por módulo', async () => {
    const result = await repository.findByModulo(1);
    expect(repo.find).toHaveBeenCalledWith({ where: { modulo: { id: 1 } }, relations: ['modulo'] });
    expect(result).toEqual([mockAula]);
  });

  it('deve buscar por curso', async () => {
    const result = await repository.findByCurso(1);
    expect(repo.find).toHaveBeenCalledWith({ where: { modulo: { curso: { id: 1 } } }, relations: ['modulo', 'modulo.curso'] });
    expect(result).toEqual([mockAula]);
  });

  it('deve buscar por id com módulo e curso', async () => {
    const result = await repository.findByIdWithModuloAndCurso(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['modulo', 'modulo.curso'] });
    expect(result).toEqual(mockAula);
  });
});
