import { IntentClassifierService } from './intent-classifier.service';

describe('IntentClassifierService', () => {
  let service: IntentClassifierService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new IntentClassifierService();
  });

  it('deve retornar fallback quando o texto for vazio ou indefinido', () => {
    const result = service.classify(undefined as any);

    expect(result.intent).toBe('desconhecida');
    expect(result.confidence).toBe(0);
    expect(result.rankings).toEqual([]);
    expect(result.originalText).toBe('');
  });

  it('deve normalizar texto, remover stopwords e retornar ranking', () => {
    const result = service.classify(
      'Quero buscar curso de inteligência artificial!!!',
    );

    expect(result.normalizedText).toBe(
      'quero buscar curso de inteligencia artificial',
    );
    expect(result.tokens.length).toBeGreaterThan(0);
    expect(result.filteredTokens).toContain('curso');
    expect(result.rankings.length).toBeGreaterThan(0);
  });

  it('deve usar fallback quando a confiança ficar abaixo do threshold', () => {
    jest
      .spyOn((service as any).classifier, 'getClassifications')
      .mockReturnValue([{ label: 'buscar_curso', value: 0.1 }]);

    const result = service.classify('curso de node');

    expect(result.intent).toBe('desconhecida');
    expect(result.confidence).toBe(0.1);
  });

  it('deve retornar a melhor intenção quando a confiança for suficiente', () => {
    jest.spyOn((service as any).classifier, 'getClassifications').mockReturnValue([
      { label: 'pesquisar', value: 0.9 },
      { label: 'buscar_curso', value: 0.2 },
    ]);

    const result = service.classify('node api');

    expect(result.intent).toBe('pesquisar');
    expect(result.rankings).toEqual([
      { label: 'pesquisar', value: 0.9 },
      { label: 'buscar_curso', value: 0.2 },
    ]);
  });
});
