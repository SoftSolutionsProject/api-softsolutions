import { Injectable } from '@nestjs/common';
import { SemanticDocument } from './semantic-document.builder';
import { CursoModel } from 'src/domain/models/curso.model';

export interface RankedSemanticResult {
  curso: CursoModel;
  score: number;
  matchedTerms: string[];
}

interface PreparedDocument {
  semantic: SemanticDocument;
  frequencies: Map<string, number>;
  uniqueTokens: Set<string>;
}

@Injectable()
export class SimpleSimilarityEngine {
  rank(query: string, documents: SemanticDocument[]): RankedSemanticResult[] {
    const normalizedQuery = this.normalize(query);
    if (!normalizedQuery) return [];

    const queryTokens = this.tokenize(normalizedQuery);
    if (!queryTokens.length) return [];

    const preparedDocs = documents.map((doc) => this.prepareDocument(doc));
    const docFrequency = this.buildDocumentFrequency(preparedDocs);
    const totalDocs = preparedDocs.length || 1;
    const distinctQueryTokens = Array.from(new Set(queryTokens));

    const results = preparedDocs
      .map((doc) => {
        let score = 0;
        const matchedTerms: string[] = [];

        distinctQueryTokens.forEach((token) => {
          const tf = doc.frequencies.get(token);
          if (tf) {
            const idf = this.idf(token, docFrequency, totalDocs);
            score += (1 + Math.log(tf)) * idf;
            matchedTerms.push(token);
          }
        });

        return { curso: doc.semantic.curso, score, matchedTerms };
      })
      .filter((result) => result.score > 0);

    return results.sort((a, b) => b.score - a.score);
  }

  private prepareDocument(doc: SemanticDocument): PreparedDocument {
    const normalized = this.normalize(doc.text);
    const tokens = this.tokenize(normalized);
    const frequencies = tokens.reduce((map, token) => {
      map.set(token, (map.get(token) ?? 0) + 1);
      return map;
    }, new Map<string, number>());

    return {
      semantic: doc,
      frequencies,
      uniqueTokens: new Set(frequencies.keys()),
    };
  }

  private buildDocumentFrequency(documents: PreparedDocument[]): Map<string, number> {
    const frequency = new Map<string, number>();
    documents.forEach((doc) => {
      doc.uniqueTokens.forEach((token) => {
        frequency.set(token, (frequency.get(token) ?? 0) + 1);
      });
    });
    return frequency;
  }

  private idf(token: string, docFrequency: Map<string, number>, totalDocs: number): number {
    const df = docFrequency.get(token) ?? 0;
    return Math.log((totalDocs + 1) / (df + 1)) + 1;
  }

  private normalize(text: string): string {
    return (text ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  private tokenize(text: string): string[] {
    return text.split(' ').filter(Boolean);
  }
}
