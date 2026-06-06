import axios from 'axios';
import { OpenAiGatewayService } from './openai-gateway.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OpenAiGatewayService', () => {
  const config = { get: jest.fn() };
  let service: OpenAiGatewayService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OpenAiGatewayService(config as any);
  });

  it('nao chama API sem chave ou texto', async () => {
    config.get.mockReturnValue(undefined);
    await expect(service.createEmbedding('texto')).resolves.toBeUndefined();
    await expect(
      service.createChatCompletion({
        messages: [],
        temperature: 0,
        maxTokens: 1,
      }),
    ).resolves.toBeUndefined();
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('cria embedding usando configuracao', async () => {
    config.get.mockImplementation((key) =>
      key === 'OPENAI_API_KEY'
        ? 'key'
        : key === 'OPENAI_EMBEDDING_MODEL'
          ? 'modelo'
          : undefined,
    );
    mockedAxios.post.mockResolvedValue({
      data: { data: [{ embedding: [1, 2] }] },
    } as any);
    await expect(service.createEmbedding(' texto ')).resolves.toEqual([1, 2]);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/embeddings'),
      expect.objectContaining({ model: 'modelo', input: 'texto' }),
      expect.any(Object),
    );
  });

  it('cria chat completion e usa modelo padrao', async () => {
    config.get.mockImplementation((key) =>
      key === 'OPENAI_API_KEY' ? 'key' : undefined,
    );
    mockedAxios.post.mockResolvedValue({
      data: { choices: [{ message: { content: 'resposta' } }] },
    } as any);
    await expect(
      service.createChatCompletion({
        messages: [{ role: 'user', content: 'oi' }],
        temperature: 1,
        maxTokens: 10,
      }),
    ).resolves.toBe('resposta');
  });

  it('retorna undefined quando a API falha', async () => {
    config.get.mockReturnValue('key');
    mockedAxios.post.mockRejectedValue(new Error('falha'));
    await expect(service.createEmbedding('texto')).resolves.toBeUndefined();
    await expect(
      service.createChatCompletion({
        messages: [],
        temperature: 0,
        maxTokens: 1,
      }),
    ).resolves.toBeUndefined();
  });
});
