import { Injectable } from '@nestjs/common';
import { PgVectorSearchService } from '../../../infrastructure/search/pgvector/pgvector-search.service';
import { QueryUnderstandingService } from '../../../infrastructure/search/nlp/query-understanding.service';
import { SearchItem } from '../../../infrastructure/search/interfaces/search-item.interface';

@Injectable()
export class SearchTextUseCase {
  private readonly smallTalkTerms = new Set([
    'oi',
    'ola',
    'olá',
    'bom dia',
    'boa tarde',
    'boa noite',
    'tudo bem',
    'obrigado',
    'valeu',
    'tchau',
  ]);

  constructor(
    private readonly searchService: PgVectorSearchService,
    private readonly queryUnderstanding: QueryUnderstandingService,
  ) {}

  async execute(query: string): Promise<SearchItem[]> {
    const normalized = this.queryUnderstanding.normalize(query ?? '');

    if (!normalized || this.smallTalkTerms.has(normalized)) {
      return [];
    }

    const processed = await this.queryUnderstanding.process(query);
    const searchQuery = processed.expandedQuery || processed.normalizedText;
    const hits = await this.searchService.search(
      searchQuery,
      processed.embedding,
    );

    return this.rerankAndFilter(hits, processed).slice(0, 5);
  }

  private rerankAndFilter(items: SearchItem[], processed: any): SearchItem[] {
    const categories = (processed.categories ?? []).map((item: string) =>
      this.queryUnderstanding.normalize(item),
    );
    const exclusions = (processed.exclusions ?? []).map((item: string) =>
      this.queryUnderstanding.normalize(item),
    );
    const matchedTerms = (processed.matchedTerms ?? []).map((item: string) =>
      this.queryUnderstanding.normalize(item),
    );

    return items
      .map((item) => {
        const searchableText = this.queryUnderstanding.normalize(
          [
            item.titulo,
            item.descricao,
            item.conteudo,
            item.curso,
            item.modulo,
            item.categoria,
          ]
            .filter(Boolean)
            .join(' '),
        );

        let score = item.semanticScore ?? 0;
        if (item.tipo === 'curso') score += 100;
        if (item.tipo === 'aula') score += 20;

        for (const term of matchedTerms) {
          if (searchableText.includes(term)) score += 10;
        }

        for (const category of categories) {
          if (
            this.queryUnderstanding.normalize(item.categoria).includes(category)
          )
            score += 30;
        }

        for (const exclusion of exclusions) {
          if (searchableText.includes(exclusion)) score -= 1000;
        }

        return { ...item, semanticScore: score };
      })
      .filter((item) => {
        if ((item.semanticScore ?? 0) <= 0) return false;
        const categoria = this.queryUnderstanding.normalize(
          item.categoria ?? '',
        );
        if (categories.includes('backend') && categoria.includes('frontend'))
          return false;
        if (categories.includes('frontend') && categoria.includes('backend'))
          return false;
        return true;
      })
      .sort((a, b) => (b.semanticScore ?? 0) - (a.semanticScore ?? 0));
  }
}
