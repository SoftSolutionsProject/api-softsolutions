import { ProgressoAulaRepository } from './progresso-aula.repository';

describe('ProgressoAulaRepository', () => {
  let repository: ProgressoAulaRepository;
  let repo: any;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    };

    repository = new ProgressoAulaRepository(repo);
  });

  it('deve criar progresso individual', async () => {
    repo.create.mockReturnValue({ concluida: false });
    repo.save.mockResolvedValue({ id: 1, concluida: false });

    await expect(repository.create({ concluida: false })).resolves.toEqual({
      id: 1,
      concluida: false,
    });
    expect(repo.create).toHaveBeenCalledWith({ concluida: false });
  });

  it('deve criar vários progressos', async () => {
    const payload = [{ concluida: false }, { concluida: true }];
    repo.create.mockReturnValue(payload);
    repo.save.mockResolvedValue(payload);

    await expect(repository.createMany(payload as any)).resolves.toEqual(payload);
    expect(repo.create).toHaveBeenCalledWith(payload);
  });

  it('deve buscar por inscrição e aula com relações', async () => {
    repo.findOne.mockResolvedValue({ id: 1 });

    await expect(repository.findByInscricaoAndAula(1, 2)).resolves.toEqual({
      id: 1,
    });
    expect(repo.findOne).toHaveBeenCalledWith({
      where: {
        inscricao: { id: 1 },
        aula: { id: 2 },
      },
      relations: ['inscricao', 'aula'],
    });
  });

  it('deve atualizar e recarregar a entidade', async () => {
    repo.update.mockResolvedValue(undefined);
    repo.findOne.mockResolvedValue({ id: 1, concluida: true });

    await expect(repository.update(1, { concluida: true })).resolves.toEqual({
      id: 1,
      concluida: true,
    });
    expect(repo.update).toHaveBeenCalledWith(1, { concluida: true });
  });

  it('deve contar concluídas por inscrição', async () => {
    repo.count.mockResolvedValue(3);

    await expect(repository.countConcluidasByInscricao(5)).resolves.toBe(3);
    expect(repo.count).toHaveBeenCalledWith({
      where: {
        inscricao: { id: 5 },
        concluida: true,
      },
    });
  });
});
