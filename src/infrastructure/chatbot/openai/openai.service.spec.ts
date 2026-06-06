import { OpenaiService } from './openai.service';

describe('OpenaiService', () => {
  const gateway = { createChatCompletion: jest.fn() };
  let service: OpenaiService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OpenaiService(gateway as any);
  });

  it('gera resposta com historico limitado e navegacao', async () => {
    gateway.createChatCompletion.mockResolvedValue('ok');
    const history = Array.from({ length: 12 }, (_, i) => ({
      role: 'user',
      content: `${i}`,
    }));
    const result = await service.generateResponse('onde', 'contexto', history, {
      navigation: [{ path: '/perfil' }],
    });
    expect(result).toBe('ok');
    const options = gateway.createChatCompletion.mock.calls[0][0];
    expect(options.messages).toHaveLength(12);
    expect(options.messages.at(-1).content).toContain('Navegacao detectada');
    expect(options.messages.at(-1).content).toContain('SIM');
  });

  it('usa fallback quando resposta principal falha', async () => {
    gateway.createChatCompletion.mockResolvedValue(undefined);
    await expect(
      service.generateResponse('x', 'Nenhum conteudo relevante encontrado'),
    ).resolves.toContain('Ocorreu um erro');
  });

  it('gera small talk com historico limitado e fallback', async () => {
    gateway.createChatCompletion
      .mockResolvedValueOnce('oi')
      .mockResolvedValueOnce(undefined);
    const history = Array.from({ length: 8 }, (_, i) => ({
      role: 'user',
      content: `${i}`,
    }));
    await expect(
      service.generateSmallTalkResponse('oi', history),
    ).resolves.toBe('oi');
    expect(gateway.createChatCompletion.mock.calls[0][0].messages).toHaveLength(
      8,
    );
    await expect(service.generateSmallTalkResponse('oi')).resolves.toContain(
      'Ola!',
    );
  });
});
