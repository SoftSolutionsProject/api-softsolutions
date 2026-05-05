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
  results!: Array<{
    id?: number | string;
    titulo: string;
    descricao: string;
    tipo?: string;
    url?: string;
    curso?: string;
    modulo?: string;
    professor?: string;
  }>;
}