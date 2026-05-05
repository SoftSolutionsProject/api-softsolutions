import { Injectable } from '@nestjs/common';
import { VoiceSearchRequestDto } from '../../../infrastructure/search/dtos/voice-search-request.dto';
import {
  VoiceSearchResponseDto,
  VoiceSearchRankingDto,
} from '../../../infrastructure/search/dtos/voice-search-response.dto';
import { IntentClassifierService } from '../../../infrastructure/search/nlp/intent-classifier.service';
import { SearchTextUseCase } from './search-text.use-case';

@Injectable()
export class SearchVoiceUseCase {
  constructor(
    private readonly intentClassifierService: IntentClassifierService,
    private readonly searchTextUseCase: SearchTextUseCase,
  ) {}

  async execute(dto: VoiceSearchRequestDto): Promise<VoiceSearchResponseDto> {
    const result = this.intentClassifierService.classify(dto.text);

    const { searchQuery, querySource, matchedTerms } = this.buildSearchQuery(
      result.intent,
      result.filteredTokens,
      result.normalizedText,
    );

    const results = searchQuery
      ? await this.searchTextUseCase.execute(searchQuery)
      : [];

    return {
      originalText: result.originalText,
      normalizedText: result.normalizedText,
      tokens: result.tokens,
      filteredTokens: result.filteredTokens,
      stems: result.stems,
      intent: result.intent,
      confidence: result.confidence,
      rankings: result.rankings.map(
        (item): VoiceSearchRankingDto => ({
          label: item.label,
          value: item.value,
        }),
      ),
      searchQuery,
      querySource,
      matchedTerms,
      results,
    };
  }

  private buildSearchQuery(
    intent: string,
    filteredTokens: string[],
    normalizedText: string,
  ): {
    searchQuery: string;
    querySource: 'filteredTokens' | 'normalizedText';
    matchedTerms: string[];
  } {
    const normalizedFallback = normalizedText.trim();
    const filteredQuery = filteredTokens.join(' ').trim();

    if (!filteredQuery) {
      return {
        searchQuery: normalizedFallback,
        querySource: 'normalizedText',
        matchedTerms: normalizedFallback.split(/\s+/).filter(Boolean),
      };
    }

    switch (intent) {
      case 'buscar_curso':
      case 'buscar_aula':
      case 'buscar_professor':
      case 'buscar_categoria':
      case 'pesquisar':
        return {
          searchQuery: filteredQuery,
          querySource: 'filteredTokens',
          matchedTerms: [...filteredTokens],
        };

      default:
        return {
          searchQuery: filteredQuery || normalizedFallback,
          querySource: filteredQuery ? 'filteredTokens' : 'normalizedText',
          matchedTerms: filteredQuery
            ? [...filteredTokens]
            : normalizedFallback.split(/\s+/).filter(Boolean),
        };
    }
  }
}