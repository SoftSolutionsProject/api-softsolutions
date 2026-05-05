export interface IntentClassificationRanking {
  label: string;
  value: number;
}

export interface IntentClassificationResult {
  originalText: string;
  normalizedText: string;
  tokens: string[];
  filteredTokens: string[];
  stems: string[];
  intent: string;
  confidence: number;
  rankings: IntentClassificationRanking[];
}

export interface IntentClassifier {
  classify(text: string): IntentClassificationResult;
}