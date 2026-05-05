import { MeilisearchService } from './meilisearch.service';

describe('MeilisearchService', () => {
  let service: MeilisearchService;
  let loggerLog: jest.SpyInstance;
  let loggerWarn: jest.SpyInstance;
  let loggerError: jest.SpyInstance;
  let originalFunction: FunctionConstructor;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MeilisearchService();
    loggerLog = jest.spyOn((service as any).logger, 'log').mockImplementation();
    loggerWarn = jest.spyOn((service as any).logger, 'warn').mockImplementation();
    loggerError = jest.spyOn((service as any).logger, 'error').mockImplementation();
    process.env.MEILI_HOST = 'http://localhost:7700';
    process.env.MEILI_API_KEY = 'key';
    originalFunction = global.Function;
  });

  afterEach(() => {
    global.Function = originalFunction;
    loggerLog.mockRestore();
    loggerWarn.mockRestore();
    loggerError.mockRestore();
  });

  const mockDynamicImport = (moduleValue: any) => {
    global.Function = jest
      .fn()
      .mockImplementation(() => jest.fn().mockResolvedValue(moduleValue)) as any;
  };

  const createIndex = (overrides?: Record<string, any>) => ({
    updateSearchableAttributes: jest.fn().mockResolvedValue(undefined),
    updateDisplayedAttributes: jest.fn().mockResolvedValue(undefined),
    updateFilterableAttributes: jest.fn().mockResolvedValue(undefined),
    updateSortableAttributes: jest.fn().mockResolvedValue(undefined),
    updateRankingRules: jest.fn().mockResolvedValue(undefined),
    updateSynonyms: jest.fn().mockResolvedValue(undefined),
    updateStopWords: jest.fn().mockResolvedValue(undefined),
    search: jest.fn().mockResolvedValue({ hits: [{ id: '1' }] }),
    deleteAllDocuments: jest.fn().mockResolvedValue({ taskUid: 1 }),
    addDocuments: jest.fn().mockResolvedValue({ taskUid: 1 }),
    ...overrides,
  });

  it('deve inicializar o cliente e configurar o índice com sucesso', async () => {
    const index = createIndex();
    const client = {
      health: jest.fn().mockResolvedValue({ status: 'available' }),
      index: jest.fn().mockReturnValue(index),
    };
    const MockClient = jest.fn().mockImplementation(() => client);
    mockDynamicImport({ MeiliSearch: MockClient });

    await service.onModuleInit();

    expect(MockClient).toHaveBeenCalledWith({
      host: 'http://localhost:7700',
      apiKey: 'key',
    });
    expect(client.health).toHaveBeenCalled();
    expect(index.updateSearchableAttributes).toHaveBeenCalled();
    expect((service as any).index).toBe(index);
  });

  it('deve usar host padrão, apiKey indefinida e status unknown quando necessário', async () => {
    delete process.env.MEILI_HOST;
    delete process.env.MEILI_API_KEY;
    const index = createIndex();
    const client = {
      health: jest.fn().mockResolvedValue(undefined),
      index: jest.fn().mockReturnValue(index),
    };
    const MockClient = jest.fn().mockImplementation(() => client);
    mockDynamicImport({ default: { Meilisearch: MockClient } });

    await service.onModuleInit();

    expect(MockClient).toHaveBeenCalledWith({
      host: 'http://127.0.0.1:7700',
      apiKey: undefined,
    });
    expect(loggerLog).toHaveBeenCalledWith(
      expect.stringContaining('API key configurada: n'),
    );
    expect(loggerLog).toHaveBeenCalledWith(
      expect.stringContaining('Status: unknown'),
    );
  });

  it('deve tratar ausência de client no pacote importado', async () => {
    mockDynamicImport({});

    await service.onModuleInit();

    expect(loggerError).toHaveBeenCalledWith(
      expect.stringContaining('Não foi possível carregar o client'),
      expect.any(String),
    );
    expect((service as any).index).toBeNull();
  });

  it('deve zerar o índice quando a inicialização falhar', async () => {
    const client = {
      health: jest.fn().mockRejectedValue(new Error('offline')),
      index: jest.fn(),
    };
    const MockClient = jest.fn().mockImplementation(() => client);
    mockDynamicImport({ MeiliSearch: MockClient });

    await service.onModuleInit();

    expect(loggerError).toHaveBeenCalled();
    expect((service as any).index).toBeNull();
  });

  it('deve zerar o índice quando a configuração do índice falhar', async () => {
    const index = createIndex({
      updateSearchableAttributes: jest.fn().mockRejectedValue(new Error('config error')),
    });
    const client = {
      health: jest.fn().mockResolvedValue({ status: 'available' }),
      index: jest.fn().mockReturnValue(index),
    };
    const MockClient = jest.fn().mockImplementation(() => client);
    mockDynamicImport({ default: MockClient });

    await service.onModuleInit();

    expect(loggerError).toHaveBeenCalledWith(
      expect.stringContaining('Erro ao inicializar Meilisearch: config error'),
      expect.any(String),
    );
    expect((service as any).index).toBeNull();
  });

  it('deve lançar erro se configureIndex for chamado sem índice', async () => {
    (service as any).index = null;

    await expect((service as any).configureIndex()).rejects.toThrow(
      'Índice do Meilisearch não foi inicializado.',
    );
  });

  it('deve retornar vazio quando search for chamado sem índice', async () => {
    (service as any).index = null;

    await expect(service.search('node')).resolves.toEqual([]);
  });

  it('deve retornar hits da busca quando o índice existir', async () => {
    const index = createIndex();
    (service as any).index = index;

    await expect(service.search('node')).resolves.toEqual([{ id: '1' }]);
    expect(index.search).toHaveBeenCalledWith('node', { limit: 10 });
  });

  it('deve retornar array vazio quando a busca não trouxer hits', async () => {
    const index = createIndex({
      search: jest.fn().mockResolvedValue({}),
    });
    (service as any).index = index;

    await expect(service.search('node')).resolves.toEqual([]);
  });

  it('deve retornar vazio quando a busca falhar', async () => {
    const index = createIndex({
      search: jest.fn().mockRejectedValue(new Error('search error')),
    });
    (service as any).index = index;

    await expect(service.search('node')).resolves.toEqual([]);
    expect(loggerError).toHaveBeenCalled();
  });

  it('deve lançar erro ao adicionar documentos sem índice', async () => {
    (service as any).index = null;

    await expect(service.replaceAllDocuments([{ id: '1' } as any])).rejects.toThrow(
      'Índice do Meilisearch não está inicializado.',
    );
  });

  it('deve adicionar documentos quando o índice estiver pronto', async () => {
    const index = createIndex();
    (service as any).index = index;

    await expect(service.replaceAllDocuments([{ id: '1' } as any])).resolves.toBeUndefined();
    expect(index.deleteAllDocuments).toHaveBeenCalled();
    expect(index.addDocuments).toHaveBeenCalledWith([{ id: '1' }], {
      primaryKey: 'id',
    });
  });

  it('deve propagar erro ao indexar documentos', async () => {
    const error = new Error('index failed');
    const index = createIndex({
      addDocuments: jest.fn().mockRejectedValue(error),
    });
    (service as any).index = index;

    await expect(service.replaceAllDocuments([{ id: '1' } as any])).rejects.toThrow(
      'index failed',
    );
    expect(index.deleteAllDocuments).toHaveBeenCalled();
  });
});
