import { ProcessChatUseCase } from './process-chat.use-case';

describe('ProcessChatUseCase', () => {
  const understanding = {
    process: jest.fn(),
    normalize: jest.fn((x) => x.toLowerCase()),
  };
  const search = { execute: jest.fn() };
  const openai = {
    generateSmallTalkResponse: jest.fn(),
    generateResponse: jest.fn(),
  };
  let useCase: ProcessChatUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ProcessChatUseCase(
      understanding as any,
      search as any,
      openai as any,
    );
  });

  it('responde small talk sem pesquisar', async () => {
    understanding.process.mockResolvedValue({
      intent: 'saudacao',
      confidence: 0.9,
    });
    openai.generateSmallTalkResponse.mockResolvedValue('Olá!');
    const result = await useCase.execute({ message: 'oi' });
    expect(result.response).toBe('Olá!');
    expect(search.execute).not.toHaveBeenCalled();
  });

  it('retorna mensagem especifica quando nao encontra curso de IA', async () => {
    understanding.process.mockResolvedValue({
      intent: 'buscar_ia',
      confidence: 0.8,
      categories: ['ia'],
      concepts: ['ml'],
    });
    search.execute.mockResolvedValue([]);
    const result = await useCase.execute({ message: 'curso ia' });
    expect(result.response).toContain('ainda nao possui cursos');
    expect(result.semanticContext?.categories).toEqual(['ia']);
  });

  it('gera resposta, contexto, sugestoes unicas e suporte humano', async () => {
    understanding.process.mockResolvedValue({
      intent: 'buscar_curso',
      confidence: 0.1,
    });
    search.execute.mockResolvedValue([
      {
        titulo: 'A',
        curso: 'Curso A',
        descricao: 'D',
        categoria: 'C',
        tipo: 'aula',
        semanticScore: 2,
      },
      {
        titulo: 'B',
        curso: 'Curso A',
        descricao: 'D',
        categoria: 'C',
        tipo: 'curso',
        semanticScore: 0,
      },
    ]);
    openai.generateResponse.mockResolvedValue('Resposta');
    const result = await useCase.execute({ message: 'curso' });
    expect(result.response).toBe('Resposta');
    expect(result.relatedCourses).toEqual(['Curso A']);
    expect(result.requiresHumanSupport).toBe(false);
    expect(openai.generateResponse.mock.calls[0][1]).toContain('Resultado 1');
  });

  it('detecta navegacao e pede suporte para intencao desconhecida', async () => {
    understanding.normalize.mockImplementation((x) => x.toLowerCase());
    understanding.process.mockResolvedValue({
      intent: 'desconhecida',
      confidence: 0,
    });
    openai.generateResponse.mockResolvedValue('Use o menu');
    const result = await useCase.execute({ message: 'perfil' });
    expect(result.requiresHumanSupport).toBe(true);
    expect(result.navigation).toBeDefined();
  });
});
