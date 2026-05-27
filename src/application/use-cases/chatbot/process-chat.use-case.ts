import { Injectable } from '@nestjs/common';
import { SearchTextUseCase } from '../search/search-text.use-case';
import { QueryUnderstandingService } from '../../../infrastructure/search/nlp/query-understanding.service';
import { OpenaiService } from '../../../infrastructure/chatbot/openai/openai.service';
import { ChatRequestDto } from '../../../interfaces/http/dtos/requests/chat-request.dto';
import { ChatResponseDto } from '../../../interfaces/http/dtos/responses/chat-response.dto';
import { PLATFORM_NAVIGATION } from '../../../infrastructure/chatbot/navigation/platform-navigation.dictionary';

@Injectable()
export class ProcessChatUseCase {
  constructor(
    private readonly queryUnderstandingService: QueryUnderstandingService,
    private readonly searchTextUseCase: SearchTextUseCase,
    private readonly openaiService: OpenaiService,
  ) {}

  async execute(dto: ChatRequestDto): Promise<ChatResponseDto> {
    const processed = await this.queryUnderstandingService.process(dto.message);
    const navigationMatch = this.detectNavigation(dto.message);

    if (['saudacao', 'agradecimento', 'despedida', 'conversa'].includes(processed.intent)) {
      const response = await this.openaiService.generateSmallTalkResponse(dto.message, dto.history ?? []);

      return {
        response,
        intent: processed.intent,
        confidence: processed.confidence,
        suggestions: [],
        requiresHumanSupport: false,
        relatedCourses: [],
        navigation: navigationMatch?.navigation ?? [],
        semanticContext: {
          intent: processed.intent,
          categories: [],
          concepts: [],
        },
      };
    }

    const searchableIntents = ['buscar_curso', 'buscar_aula', 'buscar_trilha', 'buscar_ia'];
    const results = searchableIntents.includes(processed.intent)
      ? await this.searchTextUseCase.execute(dto.message)
      : [];
    const topResults = results.filter((item: any) => item.semanticScore === undefined || item.semanticScore > 0).slice(0, 5);

    if (processed.intent === 'buscar_ia' && !topResults.length) {
      return {
        response: 'No momento, a SoftSolutions ainda nao possui cursos especificos de Inteligencia Artificial ou Machine Learning. Posso te ajudar a encontrar cursos de desenvolvimento web, backend, frontend ou tecnologias modernas de software.',
        intent: processed.intent,
        confidence: processed.confidence,
        suggestions: [],
        requiresHumanSupport: false,
        relatedCourses: [],
        navigation: navigationMatch?.navigation ?? [],
        semanticContext: {
          intent: processed.intent,
          categories: processed.categories ?? [],
          concepts: processed.concepts ?? [],
        },
      };
    }

    const context = this.buildContext(topResults);
    const requiresHumanSupport = processed.confidence < 0.15 && !topResults.length;
    const response = await this.openaiService.generateResponse(dto.message, context, dto.history ?? [], navigationMatch);
    const suggestions = this.generateSuggestions(topResults);

    return {
      response,
      intent: processed.intent,
      confidence: processed.confidence,
      suggestions,
      requiresHumanSupport,
      relatedCourses: suggestions,
      navigation: navigationMatch?.navigation ?? [],
      semanticContext: {
        intent: processed.intent,
        categories: processed.categories ?? [],
        concepts: processed.concepts ?? [],
      },
    };
  }

  private buildContext(results: any[]): string {
    if (!results.length) {
      return 'Nenhum conteudo relevante encontrado na plataforma.';
    }

    return results
      .map(
        (item, index) => `
# Resultado ${index + 1}
Titulo: ${item.titulo}
Descricao: ${item.descricao}
Categoria: ${item.categoria}
Tipo: ${item.tipo}
Curso: ${item.curso ?? 'N/A'}
Professor: ${item.professor ?? 'N/A'}
`,
      )
      .join('\n');
  }

  private generateSuggestions(results: any[]): string[] {
    return [
      ...new Set(results.map((item) => item.curso || item.titulo).filter(Boolean)),
    ].slice(0, 5);
  }

  private detectNavigation(message: string) {
    const normalized = this.queryUnderstandingService.normalize(message);
    let bestMatch: any = null;
    let bestScore = 0;

    for (const item of PLATFORM_NAVIGATION) {
      let score = 0;

      for (const keyword of item.keywords) {
        const normalizedKeyword = this.queryUnderstandingService.normalize(keyword);
        const words = normalized.split(' ');

        if (normalized === normalizedKeyword) score += 100;
        if (normalized.includes(normalizedKeyword)) score += 25;
        if (words.includes(normalizedKeyword)) score += 40;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    return bestScore >= 40 ? bestMatch : null;
  }
}

