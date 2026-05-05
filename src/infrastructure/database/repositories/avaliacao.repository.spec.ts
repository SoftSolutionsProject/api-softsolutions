import { AvaliacaoRepository } from './avaliacao.repository';

describe('AvaliacaoRepository', () => {
  let repository: AvaliacaoRepository;
  let repo: any;
  let usuarioRepo: any;
  let cursoRepo: any;
  let queryBuilder: any;

  beforeEach(() => {
    queryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
    };

    repo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };
    usuarioRepo = { findById: jest.fn() };
    cursoRepo = { findById: jest.fn() };

    repository = new AvaliacaoRepository(repo, usuarioRepo, cursoRepo);
  });

  it('deve criar avaliação quando usuário e curso existirem', async () => {
    usuarioRepo.findById.mockResolvedValue({ id: 1 });
    cursoRepo.findById.mockResolvedValue({ id: 2 });
    repo.create.mockReturnValue({ nota: 5 });
    repo.save.mockResolvedValue({ id: 10, nota: 5 });

    await expect(
      repository.create({
        nota: 5,
        comentario: 'Muito bom',
        usuarioId: 1,
        cursoId: 2,
      }),
    ).resolves.toEqual({ id: 10, nota: 5 });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        nota: 5,
        comentario: 'Muito bom',
      }),
    );
  });

  it('deve lançar erro quando usuário ou curso não existirem', async () => {
    usuarioRepo.findById.mockResolvedValue(null);
    cursoRepo.findById.mockResolvedValue({ id: 2 });

    await expect(
      repository.create({
        nota: 5,
        comentario: 'Muito bom',
        usuarioId: 1,
        cursoId: 2,
      }),
    ).rejects.toThrow('Usuário ou curso inválido.');
  });

  it('deve buscar avaliação por id com relações', async () => {
    repo.findOne.mockResolvedValue({ id: 10 });

    await expect(repository.findById(10)).resolves.toEqual({ id: 10 });
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 10 },
      relations: ['usuario', 'curso'],
    });
  });

  it('deve retornar model ao buscar por usuário e curso', async () => {
    repo.findOne.mockResolvedValue({
      id: 10,
      nota: 4,
      comentario: 'Bom',
      criadoEm: new Date(),
      atualizadoEm: new Date(),
      usuario: { id: 1 },
      curso: { id: 2 },
    });

    const result = await repository.findByUserAndCourse(1, 2);

    expect(result).toEqual(
      expect.objectContaining({
        id: 10,
        usuarioId: 1,
        cursoId: 2,
      }),
    );
  });

  it('deve retornar null quando não encontrar avaliação por usuário e curso', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(repository.findByUserAndCourse(1, 2)).resolves.toBeNull();
  });

  it('deve retornar média do curso ou zero quando avg não for numérico', async () => {
    queryBuilder.getRawOne.mockResolvedValueOnce({ avg: '4.50' });
    await expect(repository.getCourseAverage(1)).resolves.toBe(4.5);

    queryBuilder.getRawOne.mockResolvedValueOnce({ avg: null });
    await expect(repository.getCourseAverage(1)).resolves.toBe(0);
  });

  it('deve salvar entidade delegando ao repository', async () => {
    const entity = { id: 1 };
    repo.save.mockResolvedValue(entity);

    await expect(repository.save(entity as any)).resolves.toBe(entity);
  });

  it('deve mapear entidade para model e listar por curso', async () => {
    const entity = {
      id: 10,
      nota: 4,
      comentario: 'Bom',
      criadoEm: new Date(),
      atualizadoEm: new Date(),
      usuario: { id: 1 },
      curso: { id: 2 },
    };
    repo.find.mockResolvedValue([entity]);

    expect(repository.toModel(entity as any)).toEqual(
      expect.objectContaining({
        id: 10,
        usuarioId: 1,
        cursoId: 2,
      }),
    );

    await expect(repository.findByCourse(2)).resolves.toEqual([entity]);
    expect(repo.find).toHaveBeenCalledWith({
      where: { curso: { id: 2 } },
      relations: ['usuario'],
    });
  });
});
