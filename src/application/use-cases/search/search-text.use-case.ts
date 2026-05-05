import { Injectable } from '@nestjs/common';
import { MeilisearchService } from '../../../infrastructure/search/meilisearch/meilisearch.service';
import { SearchItem } from '../../../infrastructure/search/interfaces/search-item.interface';

@Injectable()
export class SearchTextUseCase {
  constructor(private readonly meiliService: MeilisearchService) {}

  async execute(query: string): Promise<SearchItem[]> {
    return this.meiliService.search(query);
  }
}