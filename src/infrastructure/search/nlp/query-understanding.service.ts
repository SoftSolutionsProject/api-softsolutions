import { Injectable } from '@nestjs/common';
import {
  AMBIGUOUS_TERMS,
  SEMANTIC_KNOWLEDGE,
} from './semantic-knowledge.dictionary';
import { OpenAiGatewayService } from '../../shared/openai-gateway.service';

interface ProcessedQuery {
  originalText: string;
  normalizedText: string;
  intent: string;
  confidence: number;
  embedding?: number[];
  tokens: string[];
  filteredTokens: string[];
  stems: string[];
  rankings: { label: string; value: number }[];
  matchedTerms: string[];
  synonyms: string[];
  concepts: string[];
  boostTerms: string[];
  exclusions: string[];
  categories: string[];
  expandedQuery: string;
}

@Injectable()
export class QueryUnderstandingService {
  private readonly stopwords = new Set([
    'quero',
    'gostaria',
    'buscar',
    'busque',
    'procure',
    'pesquisar',
    'mostrar',
    'mostre',
    'me',
    'pra',
    'pro',
    'tem',
    'quais',
    'voce',
    'voces',
    'sobre',
    'de',
    'do',
    'da',
    'dos',
    'das',
    'o',
    'a',
    'os',
    'as',
    'um',
    'uma',
    'e',
  ]);

  constructor(private readonly openAiGateway: OpenAiGatewayService) {}

  normalize(text: string): string {
    return (text ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async process(originalText: string): Promise<ProcessedQuery> {
    const normalizedText = this.normalize(originalText);
    const rawTokens = normalizedText.split(/\s+/).filter(Boolean);
    const tokens = this.removeAmbiguousTerms(rawTokens);
    const filteredTokens = tokens.filter((token) => !this.stopwords.has(token));
    const semanticContext = this.extractSemanticContext(filteredTokens);
    const expandedQuery = this.buildExpandedQuery(
      normalizedText,
      semanticContext,
    );
    const intent = this.detectIntent(
      normalizedText,
      semanticContext.categories,
    );
    const confidence = filteredTokens.length ? 0.75 : 0;
    const embedding = await this.openAiGateway.createEmbedding(
      expandedQuery || normalizedText,
    );

    return {
      originalText: originalText ?? '',
      normalizedText,
      intent,
      confidence,
      embedding,
      tokens,
      filteredTokens,
      stems: filteredTokens,
      rankings: [{ label: intent, value: confidence }],
      matchedTerms: [
        ...new Set([
          ...filteredTokens,
          ...semanticContext.synonyms,
          ...semanticContext.concepts,
          ...semanticContext.boostTerms,
        ]),
      ],
      ...semanticContext,
      expandedQuery,
    };
  }

  private removeAmbiguousTerms(tokens: string[]): string[] {
    const exclusions = new Set<string>();

    for (const token of tokens) {
      for (const ambiguous of AMBIGUOUS_TERMS[token] ?? []) {
        exclusions.add(this.normalize(ambiguous));
      }
    }

    return tokens.filter((token) => !exclusions.has(this.normalize(token)));
  }

  private extractSemanticContext(tokens: string[]) {
    const synonyms = new Set<string>();
    const concepts = new Set<string>();
    const boostTerms = new Set<string>();
    const exclusions = new Set<string>();
    const categories = new Set<string>();

    for (const token of tokens) {
      const knowledge = SEMANTIC_KNOWLEDGE[token];
      if (!knowledge) continue;

      knowledge.synonyms
        .slice(0, 4)
        .forEach((item) => synonyms.add(this.normalize(item)));
      knowledge.concepts
        .slice(0, 3)
        .forEach((item) => concepts.add(this.normalize(item)));
      knowledge.boostTerms
        .slice(0, 4)
        .forEach((item) => boostTerms.add(this.normalize(item)));
      knowledge.exclusions?.forEach((item) =>
        exclusions.add(this.normalize(item)),
      );
      categories.add(this.normalize(knowledge.category));
    }

    return {
      synonyms: [...synonyms],
      concepts: [...concepts],
      boostTerms: [...boostTerms],
      exclusions: [...exclusions],
      categories: [...categories],
    };
  }

  private buildExpandedQuery(
    normalizedText: string,
    semanticContext: any,
  ): string {
    return [
      ...new Set(
        [
          normalizedText,
          ...semanticContext.synonyms,
          ...semanticContext.concepts,
          ...semanticContext.boostTerms,
        ].filter(Boolean),
      ),
    ].join(' ');
  }

  private detectIntent(normalizedText: string, categories: string[]): string {
    if (
      ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite'].includes(
        normalizedText,
      )
    ) {
      return 'saudacao';
    }

    if (/(obrigad|valeu)/.test(normalizedText)) return 'agradecimento';
    if (/(tchau|ate mais|até mais)/.test(normalizedText)) return 'despedida';
    if (/(tudo bem|como vai)/.test(normalizedText)) return 'conversa';
    if (
      /(ia|inteligencia artificial|machine learning|chatgpt|llm)/.test(
        normalizedText,
      )
    ) {
      return 'buscar_ia';
    }
    if (/(aula|modulo|video|conteudo)/.test(normalizedText))
      return 'buscar_aula';
    if (/(trilha|carreira|roadmap)/.test(normalizedText))
      return 'buscar_trilha';
    if (/(certificado|diploma)/.test(normalizedText)) return 'certificado';
    if (/(login|senha|entrar|acesso)/.test(normalizedText)) return 'login';
    if (
      categories.length ||
      /(curso|aprender|estudar|backend|frontend|python|react|java|sql|docker)/.test(
        normalizedText,
      )
    ) {
      return 'buscar_curso';
    }

    return 'desconhecida';
  }
}
