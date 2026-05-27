import { SearchItem } from '../interfaces/search-item.interface';

export class VoiceSearchRankingDto {
  label!: string;
  value!: number;
}

export class VoiceSearchResponseDto {
  originalText!: string;
  normalizedText!: string;
  tokens!: string[];
  filteredTokens!: string[];
  stems!: string[];
  intent!: string;
  confidence!: number;
  rankings!: VoiceSearchRankingDto[];
  searchQuery!: string;
  querySource!: 'filteredTokens' | 'normalizedText';
  matchedTerms!: string[];
  results!: SearchItem[];
}
