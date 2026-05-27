import { Injectable } from '@nestjs/common';
import { OpenAiGatewayService } from '../../shared/openai-gateway.service';

@Injectable()
export class OpenaiService {
  constructor(private readonly openAiGateway: OpenAiGatewayService) {}

  async generateResponse(
    userMessage: string,
    context: string,
    conversationHistory: Array<{ role: string; content: string }> = [],
    navigationContext?: any,
  ): Promise<string> {
    const hasRelevantContext = !context.includes(
      'Nenhum conteudo relevante encontrado',
    );
    const messages: Array<{ role: string; content: string }> = [
      {
        role: 'system',
        content: `
Voce e o assistente oficial da plataforma educacional SoftSolutions.

Regras:
- responda em portugues do Brasil;
- use somente o contexto fornecido para recomendar cursos;
- nao invente cursos, tecnologias, trilhas ou funcionalidades;
- ajude o usuario a navegar pela plataforma quando houver contexto de navegacao;
- seja objetivo, natural e amigavel;
- nao seja insistente nem transforme toda resposta em venda.
`,
      },
    ];

    for (const item of conversationHistory.slice(-10)) {
      messages.push({
        role: item.role,
        content: item.content,
      });
    }

    const navigationInstructions = navigationContext
      ? `
Navegacao detectada:
${JSON.stringify(navigationContext.navigation, null, 2)}

Explique naturalmente como acessar.
`
      : '';

    messages.push({
      role: 'user',
      content: `
Pergunta atual:
${userMessage}

Contexto encontrado:
${context}

${navigationInstructions}

Existe contexto relevante? ${hasRelevantContext ? 'SIM' : 'NAO'}
`,
    });

    const response = await this.openAiGateway.createChatCompletion({
      messages,
      temperature: 0.45,
      maxTokens: 450,
    });

    return response ?? 'Ocorreu um erro ao processar sua solicitacao.';
  }

  async generateSmallTalkResponse(
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }> = [],
  ): Promise<string> {
    const messages: Array<{ role: string; content: string }> = [
      {
        role: 'system',
        content:
          'Voce e o assistente oficial da SoftSolutions. Responda de forma curta, natural e amigavel.',
      },
    ];

    for (const item of conversationHistory.slice(-6)) {
      messages.push({
        role: item.role,
        content: item.content,
      });
    }

    messages.push({
      role: 'user',
      content: userMessage,
    });

    const response = await this.openAiGateway.createChatCompletion({
      messages,
      temperature: 0.7,
      maxTokens: 120,
    });

    return response ?? 'Ola! Como posso te ajudar?';
  }
}
