import { MeilisearchIndexerService } from './meilisearch-indexer.service';

describe('MeilisearchIndexerService', () => {
  let service: MeilisearchIndexerService;
  let cursoRepository: { find: jest.Mock };
  let meilisearchService: { replaceAllDocuments: jest.Mock };
  let loggerWarn: jest.SpyInstance;
  let loggerLog: jest.SpyInstance;

  beforeEach(() => {
    cursoRepository = { find: jest.fn() };
    meilisearchService = { replaceAllDocuments: jest.fn() };
    service = new MeilisearchIndexerService(
      cursoRepository as any,
      meilisearchService as any,
    );
    loggerWarn = jest.spyOn((service as any).logger, 'warn').mockImplementation();
    loggerLog = jest.spyOn((service as any).logger, 'log').mockImplementation();
  });

  afterEach(() => {
    loggerWarn.mockRestore();
    loggerLog.mockRestore();
  });

  it('deve indexar cursos e aulas com os campos esperados', async () => {
    cursoRepository.find.mockResolvedValue([
      {
        id: 1,
        nomeCurso: 'Curso Node',
        descricaoCurta: 'Curta',
        descricaoDetalhada: 'Detalhada',
        categoria: 'Backend',
        professor: 'Lucas',
        status: 'ativo',
        avaliacao: 4.5,
        imagemCurso: 'img.png',
        tempoCurso: 30,
        modulos: [
          {
            nomeModulo: 'API',
            aulas: [
              {
                id: 10,
                nomeAula: 'Nest',
                descricaoConteudo: 'Controllers',
                materialApoio: ['pdf'],
                videoUrl: 'video',
                tempoAula: 15,
              },
            ],
          },
        ],
      },
    ]);

    await service.reindexCursosEAulas();

    expect(cursoRepository.find).toHaveBeenCalledWith({
      relations: ['modulos', 'modulos.aulas'],
    });
    expect(meilisearchService.replaceAllDocuments).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'curso-1',
          tipo: 'curso',
          titulo: 'Curso Node',
        }),
        expect.objectContaining({
          id: 'aula-10',
          tipo: 'aula',
          titulo: 'Nest',
          modulo: 'API',
        }),
      ]),
    );
  });

  it('deve usar fallback e não falhar com módulos ou aulas ausentes', async () => {
    cursoRepository.find.mockResolvedValue([
      {
        id: 2,
        nomeCurso: 'Curso Sem Aula',
        descricaoCurta: undefined,
        descricaoDetalhada: undefined,
        categoria: undefined,
        professor: undefined,
        status: undefined,
        avaliacao: undefined,
        imagemCurso: undefined,
        tempoCurso: undefined,
        modulos: undefined,
      },
    ]);

    await service.reindexCursosEAulas();

    expect(meilisearchService.replaceAllDocuments).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 'curso-2',
        categoria: '',
        professor: '',
        tempoCurso: null,
      }),
    ]);
  });

  it('deve aplicar fallbacks também nos documentos de aula', async () => {
    cursoRepository.find.mockResolvedValue([
      {
        id: 3,
        nomeCurso: 'Curso Aulas',
        descricaoCurta: '',
        descricaoDetalhada: '',
        categoria: '',
        professor: '',
        status: '',
        avaliacao: undefined,
        imagemCurso: '',
        tempoCurso: undefined,
        modulos: [
          {
            nomeModulo: '',
            aulas: [
              {
                id: 22,
                nomeAula: 'Aula sem extras',
                descricaoConteudo: undefined,
                materialApoio: undefined,
                videoUrl: undefined,
                tempoAula: undefined,
              },
            ],
          },
          {
            nomeModulo: 'Vazio',
            aulas: undefined,
          },
        ],
      },
    ]);

    await service.reindexCursosEAulas();

    expect(meilisearchService.replaceAllDocuments).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'aula-22',
          descricao: '',
          categoria: '',
          tags: [],
          conteudo: 'Aula sem extras Curso Aulas',
          professor: '',
          status: '',
          avaliacao: null,
          tempoCurso: null,
          modulo: '',
          videoUrl: '',
          tempoAula: null,
        }),
      ]),
    );
  });

  it('deve fazer early return quando não houver documentos', async () => {
    cursoRepository.find.mockResolvedValue([]);

    await service.reindexCursosEAulas();

    expect(loggerWarn).toHaveBeenCalled();
    expect(meilisearchService.replaceAllDocuments).not.toHaveBeenCalled();
  });
});
