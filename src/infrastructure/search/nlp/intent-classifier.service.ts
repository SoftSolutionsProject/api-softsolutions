import { Injectable } from '@nestjs/common';
import * as natural from 'natural';
import { removeStopwords, porBr } from 'stopword';
import {
  IntentClassifier,
  IntentClassificationResult,
} from '../interfaces/intent-classifier.interface';

@Injectable()
export class IntentClassifierService implements IntentClassifier {
  private readonly tokenizer = new natural.WordTokenizer();
  private readonly classifier = new natural.BayesClassifier();
  private readonly fallbackIntent = 'desconhecida';
  private readonly confidenceThreshold = 0.35;

  constructor() {
    this.train();
  }

  classify(text: string): IntentClassificationResult {
    const originalText = text ?? '';
    const normalizedText = this.normalizeText(originalText);
    const tokens = this.tokenize(normalizedText);
    const filteredTokens = this.removeStopWords(tokens);
    const stems = filteredTokens.map((token) => this.stem(token));
    const processedText = stems.join(' ').trim();

    if (!processedText) {
      return {
        originalText,
        normalizedText,
        tokens,
        filteredTokens,
        stems,
        intent: this.fallbackIntent,
        confidence: 0,
        rankings: [],
      };
    }

    const classifications = this.classifier.getClassifications(processedText);
    const best = classifications[0];

    const bestIntent =
      best && best.value >= this.confidenceThreshold
        ? best.label
        : this.fallbackIntent;

    return {
      originalText,
      normalizedText,
      tokens,
      filteredTokens,
      stems,
      intent: bestIntent,
      confidence: best?.value ?? 0,
      rankings: classifications.map((item) => ({
        label: item.label,
        value: item.value,
      })),
    };
  }

  private train(): void {
    const samples: Array<{ text: string; intent: string }> = [
      // buscar_curso
      { text: 'quero buscar curso de python', intent: 'buscar_curso' },
      { text: 'procure curso de react', intent: 'buscar_curso' },
      { text: 'encontre cursos de programacao', intent: 'buscar_curso' },
      { text: 'buscar curso de javascript', intent: 'buscar_curso' },
      { text: 'tem curso de backend', intent: 'buscar_curso' },
      { text: 'quais cursos de frontend voces tem', intent: 'buscar_curso' },
      { text: 'me mostra curso de node', intent: 'buscar_curso' },
      { text: 'procurar treinamento de java', intent: 'buscar_curso' },
      { text: 'curso de banco de dados', intent: 'buscar_curso' },
      { text: 'curso de inteligencia artificial', intent: 'buscar_curso' },

      // buscar_aula
      { text: 'buscar aula de javascript', intent: 'buscar_aula' },
      { text: 'quero aula de react native', intent: 'buscar_aula' },
      { text: 'tem aula de api rest', intent: 'buscar_aula' },
      { text: 'me mostra aula de typescript', intent: 'buscar_aula' },
      { text: 'procurar aula sobre banco de dados', intent: 'buscar_aula' },
      { text: 'encontre aula de poo', intent: 'buscar_aula' },
      { text: 'buscar modulo de css', intent: 'buscar_aula' },
      { text: 'aula de javascript avancado', intent: 'buscar_aula' },
      { text: 'aula de node com express', intent: 'buscar_aula' },

      // buscar_professor
      { text: 'buscar curso do professor joao', intent: 'buscar_professor' },
      { text: 'tem aula com professor maria', intent: 'buscar_professor' },
      { text: 'me mostra cursos do professor pedro', intent: 'buscar_professor' },
      { text: 'procurar professor de python', intent: 'buscar_professor' },
      { text: 'curso com professor carlos', intent: 'buscar_professor' },

      // buscar_categoria
      { text: 'buscar cursos de inteligencia artificial', intent: 'buscar_categoria' },
      { text: 'quero cursos de programacao', intent: 'buscar_categoria' },
      { text: 'tem aulas de banco de dados', intent: 'buscar_categoria' },
      { text: 'procurar cursos da categoria frontend', intent: 'buscar_categoria' },
      { text: 'me mostra conteudos de backend', intent: 'buscar_categoria' },
      { text: 'cursos de desenvolvimento web', intent: 'buscar_categoria' },

      // pesquisar
      { text: 'python para iniciantes', intent: 'pesquisar' },
      { text: 'javascript avancado', intent: 'pesquisar' },
      { text: 'react native com expo', intent: 'pesquisar' },
      { text: 'api node typescript', intent: 'pesquisar' },
      { text: 'curso backend java', intent: 'pesquisar' },
      { text: 'inteligencia artificial', intent: 'pesquisar' },
      { text: 'banco de dados relacional', intent: 'pesquisar' },
      { text: 'front end com react', intent: 'pesquisar' },
    ];

    for (const sample of samples) {
      const processed = this.preprocess(sample.text);

      if (processed) {
        this.classifier.addDocument(processed, sample.intent);
      }
    }

    this.classifier.train();
  }

  private preprocess(text: string): string {
    const normalizedText = this.normalizeText(text);
    const tokens = this.tokenize(normalizedText);
    const filteredTokens = this.removeStopWords(tokens);
    const stems = filteredTokens.map((token) => this.stem(token));

    return stems.join(' ').trim();
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private tokenize(text: string): string[] {
    return (this.tokenizer.tokenize(text) ?? []).filter(Boolean);
  }

  private removeStopWords(tokens: string[]): string[] {
    const customStopwords = [
      'quero',
      'gostaria',
      'buscar',
      'busque',
      'procure',
      'procurar',
      'pesquisar',
      'pesquise',
      'encontre',
      'achar',
      'ver',
      'mostra',
      'mostrar',
      'me',
      'pra',
      'pro',
      'tem',
      'quais',
      'voces',
      'voce',
    ];

    return removeStopwords(tokens, [...porBr, ...customStopwords]).filter(
      (token) => token.length > 1,
    );
  }

  private stem(token: string): string {
    return natural.PorterStemmerPt.stem(token);
  }
}