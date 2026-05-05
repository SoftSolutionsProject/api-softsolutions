import { SearchVoiceUseCase } from './search-voice.use-case';

describe('SearchVoiceUseCase', () => {
  let useCase: SearchVoiceUseCase;
  let mockIntentClassifier: any;
  let mockSearchTextUseCase: any;

  beforeEach(() => {
    mockIntentClassifier = {
      classify: jest.fn(),
    };
    mockSearchTextUseCase = {
      execute: jest.fn(),
    };
    useCase = new SearchVoiceUseCase(
      mockIntentClassifier,
      mockSearchTextUseCase,
    );
  });

  it('deve buscar usando filteredTokens para intenções mapeadas', async () => {
    mockIntentClassifier.classify.mockReturnValue({
      originalText: 'buscar curso python',
      normalizedText: 'buscar curso python',
      tokens: ['buscar', 'curso', 'python'],
      filteredTokens: ['curso', 'python'],
      stems: ['curs', 'python'],
      intent: 'buscar_curso',
      confidence: 0.8,
      rankings: [{ label: 'buscar_curso', value: 0.8 }],
    });
    mockSearchTextUseCase.execute.mockResolvedValue([{ id: 1 }]);

    const result = await useCase.execute({ text: 'buscar curso python' });

    expect(mockIntentClassifier.classify).toHaveBeenCalledWith(
      'buscar curso python',
    );
    expect(mockSearchTextUseCase.execute).toHaveBeenCalledWith('curso python');
    expect(result.querySource).toBe('filteredTokens');
    expect(result.matchedTerms).toEqual(['curso', 'python']);
    expect(result.rankings).toEqual([{ label: 'buscar_curso', value: 0.8 }]);
  });

  it('deve usar normalizedText quando filteredTokens vier vazio', async () => {
    mockIntentClassifier.classify.mockReturnValue({
      originalText: 'node avançado',
      normalizedText: 'node avançado',
      tokens: ['node', 'avançado'],
      filteredTokens: [],
      stems: ['node', 'avanc'],
      intent: 'desconhecida',
      confidence: 0.3,
      rankings: [],
    });
    mockSearchTextUseCase.execute.mockResolvedValue([]);

    const result = await useCase.execute({ text: 'node avançado' });

    expect(mockSearchTextUseCase.execute).toHaveBeenCalledWith('node avançado');
    expect(result.querySource).toBe('normalizedText');
    expect(result.matchedTerms).toEqual(['node', 'avançado']);
  });

  it('deve cair no default e preferir filteredTokens quando houver tokens', async () => {
    mockIntentClassifier.classify.mockReturnValue({
      originalText: 'mostrar novidades backend',
      normalizedText: 'mostrar novidades backend',
      tokens: ['mostrar', 'novidades', 'backend'],
      filteredTokens: ['novidades', 'backend'],
      stems: ['novidad', 'backend'],
      intent: 'outra_intencao',
      confidence: 0.5,
      rankings: [],
    });
    mockSearchTextUseCase.execute.mockResolvedValue([{ id: 2 }]);

    const result = await useCase.execute({ text: 'mostrar novidades backend' });

    expect(result.searchQuery).toBe('novidades backend');
    expect(result.querySource).toBe('filteredTokens');
    expect(result.matchedTerms).toEqual(['novidades', 'backend']);
  });

  it('deve não chamar searchTextUseCase quando searchQuery ficar vazia', async () => {
    mockIntentClassifier.classify.mockReturnValue({
      originalText: '   ',
      normalizedText: '   ',
      tokens: [],
      filteredTokens: [],
      stems: [],
      intent: 'pesquisar',
      confidence: 0,
      rankings: [],
    });

    const result = await useCase.execute({ text: '   ' });

    expect(mockSearchTextUseCase.execute).not.toHaveBeenCalled();
    expect(result.searchQuery).toBe('');
    expect(result.results).toEqual([]);
  });

  it('deve expor o branch default do buildSearchQuery diretamente', () => {
    expect(
      (useCase as any).buildSearchQuery('intencao_x', ['backend'], 'backend curso'),
    ).toEqual({
      searchQuery: 'backend',
      querySource: 'filteredTokens',
      matchedTerms: ['backend'],
    });
  });
});
