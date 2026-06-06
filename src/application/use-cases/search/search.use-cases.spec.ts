import { SearchTextUseCase } from './search-text.use-case';
import { SearchVoiceUseCase } from './search-voice.use-case';

describe('Search use cases', () => {
  const understanding = {
    normalize: jest.fn((value: string) =>
      (value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''),
    ),
    process: jest.fn(),
  };
  const searchService = { search: jest.fn() };

  beforeEach(() => jest.clearAllMocks());

  it('ignora consulta vazia e conversa curta', async () => {
    const useCase = new SearchTextUseCase(
      searchService as any,
      understanding as any,
    );
    await expect(useCase.execute('')).resolves.toEqual([]);
    await expect(useCase.execute('Olá')).resolves.toEqual([]);
    expect(searchService.search).not.toHaveBeenCalled();
  });

  it('reordena, filtra exclusoes e limita resultados', async () => {
    understanding.process.mockResolvedValue({
      normalizedText: 'backend',
      expandedQuery: 'backend api',
      embedding: [1],
      categories: ['backend'],
      exclusions: ['php'],
      matchedTerms: ['api'],
    });
    searchService.search.mockResolvedValue([
      item('1', 'curso', 'Backend API', 'backend', 1),
      item('2', 'aula', 'API prática', 'backend', 50),
      item('3', 'curso', 'Frontend API', 'frontend', 100),
      item('4', 'curso', 'Backend PHP', 'backend', 100),
      item('5', 'aula', 'Irrelevante', 'backend', -100),
    ]);
    const useCase = new SearchTextUseCase(
      searchService as any,
      understanding as any,
    );

    const result = await useCase.execute('backend');

    expect(searchService.search).toHaveBeenCalledWith('backend api', [1]);
    expect(result.map((x) => x.id)).toEqual(['1', '2']);
  });

  it('filtra backend em busca frontend e aceita valores opcionais', async () => {
    understanding.process.mockResolvedValue({
      normalizedText: 'frontend',
      categories: ['frontend'],
    });
    searchService.search.mockResolvedValue([
      {
        ...item('1', 'curso', 'React', 'frontend', undefined as any),
        descricao: undefined,
        conteudo: undefined,
        curso: undefined,
        modulo: undefined,
      },
      item('2', 'curso', 'Java', 'backend', 100),
    ]);
    const useCase = new SearchTextUseCase(
      searchService as any,
      understanding as any,
    );

    const result = await useCase.execute('frontend');

    expect(searchService.search).toHaveBeenCalledWith('frontend', undefined);
    expect(result.map((x) => x.id)).toEqual(['1']);
  });

  it('monta resposta de busca por voz com valores padrao', async () => {
    understanding.process.mockResolvedValue({
      originalText: 'curso',
      normalizedText: 'curso',
      intent: 'buscar_curso',
      confidence: 0.75,
    });
    const textSearch = { execute: jest.fn().mockResolvedValue([item('1')]) };
    const useCase = new SearchVoiceUseCase(
      understanding as any,
      textSearch as any,
    );

    const result = await useCase.execute({ text: 'curso' });

    expect(result.querySource).toBe('normalizedText');
    expect(result.tokens).toEqual([]);
    expect(result.results).toHaveLength(1);
  });

  it('usa tokens filtrados e consulta expandida na busca por voz', async () => {
    understanding.process.mockResolvedValue({
      originalText: 'curso',
      normalizedText: 'curso',
      expandedQuery: 'curso backend',
      filteredTokens: ['curso'],
      tokens: ['curso'],
      stems: ['curso'],
      rankings: [],
      matchedTerms: ['backend'],
      intent: 'buscar_curso',
      confidence: 1,
    });
    const useCase = new SearchVoiceUseCase(
      understanding as any,
      { execute: jest.fn().mockResolvedValue([]) } as any,
    );
    const result = await useCase.execute({ text: 'curso' });
    expect(result.querySource).toBe('filteredTokens');
    expect(result.searchQuery).toBe('curso backend');
  });
});

function item(
  id = '1',
  tipo: 'curso' | 'aula' = 'curso',
  titulo = 'Curso',
  categoria = 'backend',
  semanticScore = 1,
): any {
  return {
    id,
    tipo,
    titulo,
    categoria,
    semanticScore,
    descricao: '',
    conteudo: '',
    curso: titulo,
    modulo: '',
    professor: '',
  };
}
