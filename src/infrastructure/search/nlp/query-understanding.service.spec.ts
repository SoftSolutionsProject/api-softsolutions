import { QueryUnderstandingService } from './query-understanding.service';

describe('QueryUnderstandingService', () => {
  const gateway = { createEmbedding: jest.fn() };
  let service: QueryUnderstandingService;

  beforeEach(() => {
    jest.clearAllMocks();
    gateway.createEmbedding.mockResolvedValue([0.1, 0.2]);
    service = new QueryUnderstandingService(gateway as any);
  });

  it('normaliza texto com acentos, pontuacao e espacos', () => {
    expect(service.normalize('  Olá,   VOCÊ! ')).toBe('ola voce');
    expect(service.normalize(null as any)).toBe('');
  });

  it.each([
    ['Olá', 'saudacao'],
    ['muito obrigado', 'agradecimento'],
    ['tchau', 'despedida'],
    ['como vai', 'conversa'],
    ['curso de inteligência artificial', 'buscar_ia'],
    ['aula de docker', 'buscar_aula'],
    ['trilha backend', 'buscar_trilha'],
    ['emitir certificado', 'certificado'],
    ['esqueci minha senha', 'login'],
    ['aprender python', 'buscar_curso'],
    ['assunto desconhecido xyz', 'desconhecida'],
  ])('detecta a intencao de "%s"', async (text, intent) => {
    const result = await service.process(text);
    expect(result.intent).toBe(intent);
  });

  it('expande consulta com conhecimento semantico e remove stopwords', async () => {
    const result = await service.process('quero aprender backend');

    expect(result.filteredTokens).not.toContain('quero');
    expect(result.categories).toContain('backend');
    expect(result.expandedQuery).toContain('backend');
    expect(result.embedding).toEqual([0.1, 0.2]);
    expect(gateway.createEmbedding).toHaveBeenCalledWith(result.expandedQuery);
  });

  it('retorna confianca zero para texto vazio', async () => {
    const result = await service.process('');
    expect(result.confidence).toBe(0);
    expect(result.filteredTokens).toEqual([]);
  });
});
