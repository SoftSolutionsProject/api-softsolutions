import { SearchController } from './search.controller';
import { SearchTextUseCase } from '../../../application/use-cases/search/search-text.use-case';
import { SearchVoiceUseCase } from '../../../application/use-cases/search/search-voice.use-case';
import { MeilisearchIndexerService } from '../../../infrastructure/search/meilisearch/meilisearch-indexer.service';

describe('SearchController', () => {
  let controller: SearchController;
  let mockSearchTextUseCase: any;
  let mockSearchVoiceUseCase: any;
  let mockMeilisearchIndexerService: any;

  beforeEach(() => {
    mockSearchTextUseCase = {
      execute: jest.fn().mockResolvedValue([]),
    };
    mockSearchVoiceUseCase = {
      execute: jest.fn().mockResolvedValue({}),
    };
    mockMeilisearchIndexerService = {
      reindexCursosEAulas: jest.fn().mockResolvedValue(undefined),
    };
    controller = new SearchController(
      mockSearchTextUseCase,
      mockSearchVoiceUseCase,
      mockMeilisearchIndexerService,
    );
  });

  it('deve instanciar a classe', () => {
    expect(controller).toBeDefined();
  });

  it('deve ter método textSearch definido', () => {
    expect(typeof controller.textSearch).toBe('function');
  });

  it('deve ter método voiceSearch definido', () => {
    expect(typeof controller.voiceSearch).toBe('function');
  });

  it('deve ter método reindex definido', () => {
    expect(typeof controller.reindex).toBe('function');
  });

  it('deve retornar resultados de busca textual', async () => {
    const mockResults = [{ id: 1, titulo: 'Curso de Python' }];
    mockSearchTextUseCase.execute.mockResolvedValueOnce(mockResults);

    const result = await controller.textSearch({ q: 'python' } as any);

    expect(mockSearchTextUseCase.execute).toHaveBeenCalledWith('python');
    expect(result).toHaveProperty('results');
    expect(result.results).toEqual(mockResults);
  });

  it('deve retornar resultados de busca por voz', async () => {
    const mockResult = {
      originalText: 'buscar curso',
      normalizedText: 'buscar curso',
      tokens: ['buscar', 'curso'],
      filteredTokens: ['curso'],
      stems: ['curs'],
      intent: 'buscar_curso',
      confidence: 0.8,
      rankings: [],
      searchQuery: 'curso',
      querySource: 'filteredTokens',
      matchedTerms: ['curso'],
      results: [],
    };
    mockSearchVoiceUseCase.execute.mockResolvedValueOnce(mockResult);

    const result = await controller.voiceSearch({ text: 'buscar curso' } as any);

    expect(mockSearchVoiceUseCase.execute).toHaveBeenCalledWith({ text: 'buscar curso' });
    expect(result).toEqual(mockResult);
  });

  it('deve executar reindexação', async () => {
    const result = await controller.reindex();

    expect(mockMeilisearchIndexerService.reindexCursosEAulas).toHaveBeenCalled();
    expect(result).toHaveProperty('message');
  });
});