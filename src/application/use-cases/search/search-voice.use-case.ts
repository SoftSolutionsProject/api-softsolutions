import { Injectable } from '@nestjs/common';
import { VoiceSearchRequestDto } from '../../../infrastructure/search/dtos/voice-search-request.dto';
import { VoiceSearchResponseDto } from '../../../infrastructure/search/dtos/voice-search-response.dto';
import { QueryUnderstandingService } from '../../../infrastructure/search/nlp/query-understanding.service';
import { SearchTextUseCase } from './search-text.use-case';

@Injectable()
export class SearchVoiceUseCase {
  constructor(
    private readonly queryUnderstanding: QueryUnderstandingService,
    private readonly searchTextUseCase: SearchTextUseCase,
  ) {}

  async execute(dto: VoiceSearchRequestDto): Promise<VoiceSearchResponseDto> {
    const processed = await this.queryUnderstanding.process(dto.text);
    const results = await this.searchTextUseCase.execute(dto.text);

    return {
      originalText: processed.originalText,
      normalizedText: processed.normalizedText,
      tokens: processed.tokens ?? [],
      filteredTokens: processed.filteredTokens ?? [],
      stems: processed.stems ?? [],
      intent: processed.intent,
      confidence: processed.confidence,
      rankings: processed.rankings ?? [],
      searchQuery: processed.expandedQuery || processed.normalizedText,
      querySource: processed.filteredTokens?.length ? 'filteredTokens' : 'normalizedText',
      matchedTerms: processed.matchedTerms ?? [],
      results,
    };
  }
}
