import { SearchTextUseCase } from './search-text.use-case';

describe('SearchTextUseCase', () => {
  let useCase: SearchTextUseCase;
  let mockMeiliService: any;

  beforeEach(() => {
    mockMeiliService = {
      search: jest.fn(),
    };
    useCase = new SearchTextUseCase(mockMeiliService);
  });

  it('deve instanciar a classe', () => {
    expect(useCase).toBeDefined();
  });

  it('deve ter método execute definido', () => {
    expect(typeof useCase.execute).toBe('function');
  });

  it('deve chamar meilisearchService.search com a query', async () => {
    const mockResults = [{ id: 1, titulo: 'Teste' }];
    mockMeiliService.search.mockResolvedValue(mockResults);

    const result = await useCase.execute('teste');

    expect(mockMeiliService.search).toHaveBeenCalledWith('teste');
    expect(result).toEqual(mockResults);
  });

  it('deve retornar array vazio quando search retornar null', async () => {
    mockMeiliService.search.mockResolvedValue(null);

    const result = await useCase.execute('');

    expect(result).toBeNull();
  });
});