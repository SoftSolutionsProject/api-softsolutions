import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OpenAiGatewayService {
  private readonly logger = new Logger(OpenAiGatewayService.name);
  private readonly baseUrl = 'https://api.openai.com/v1';

  constructor(private readonly configService: ConfigService) {}

  async createEmbedding(text: string): Promise<number[] | undefined> {
    const apiKey = this.getApiKey();
    const input = text?.trim();

    if (!apiKey || !input) {
      return undefined;
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/embeddings`,
        {
          model: this.configService.get<string>('OPENAI_EMBEDDING_MODEL') ?? 'text-embedding-3-small',
          input,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      );

      return response.data?.data?.[0]?.embedding;
    } catch (error: any) {
      this.logger.warn(`Falha ao gerar embedding: ${error?.response?.data?.error?.message ?? error?.message ?? error}`);
      return undefined;
    }
  }

  async createChatCompletion(options: {
    messages: Array<{ role: string; content: string }>;
    temperature: number;
    maxTokens: number;
  }): Promise<string | undefined> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      return undefined;
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.configService.get<string>('OPENAI_CHAT_MODEL') ?? 'gpt-4.1-mini',
          temperature: options.temperature,
          max_tokens: options.maxTokens,
          messages: options.messages,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      );

      return response.data?.choices?.[0]?.message?.content;
    } catch (error: any) {
      this.logger.warn(`Falha ao consultar OpenAI: ${error?.response?.data?.error?.message ?? error?.message ?? error}`);
      return undefined;
    }
  }

  private getApiKey(): string | undefined {
    return this.configService.get<string>('OPENAI_API_KEY');
  }
}
