import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { SearchTextUseCase } from '../../../application/use-cases/search/search-text.use-case';
import { SearchVoiceUseCase } from '../../../application/use-cases/search/search-voice.use-case';
import { PgVectorSearchService } from '../../../infrastructure/search/pgvector/pgvector-search.service';
import { TextSearchQueryDto } from '../../../infrastructure/search/dtos/text-search-query.dto';
import { VoiceSearchRequestDto } from '../../../infrastructure/search/dtos/voice-search-request.dto';
import { VoiceSearchResponseDto } from '../../../infrastructure/search/dtos/voice-search-response.dto';
import { SearchItem } from '../../../infrastructure/search/interfaces/search-item.interface';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchTextUseCase: SearchTextUseCase,
    private readonly searchVoiceUseCase: SearchVoiceUseCase,
    private readonly searchService: PgVectorSearchService,
  ) {}

  @Get('text-search')
  async textSearch(@Query() query: TextSearchQueryDto): Promise<{
    results: SearchItem[];
    total: number;
    query: string;
  }> {
    const results = await this.searchTextUseCase.execute(query.q);

    return {
      results,
      total: results.length,
      query: query.q,
    };
  }

  @Get('autocomplete')
  async autocomplete(
    @Query('q') q: string,
  ): Promise<{ suggestions: string[] }> {
    return {
      suggestions: await this.searchService.getSuggestions(q),
    };
  }

  @Post('voice')
  @HttpCode(200)
  async voiceSearch(
    @Body() dto: VoiceSearchRequestDto,
  ): Promise<VoiceSearchResponseDto> {
    return this.searchVoiceUseCase.execute(dto);
  }

  @Post('reindex')
  @HttpCode(200)
  async reindex(): Promise<{
    message: string;
    totalDocuments: number;
    documentsWithEmbedding: number;
  }> {
    const result = await this.searchService.reindexCursosEAulas();

    return {
      message: 'Reindexacao concluida com sucesso.',
      totalDocuments: result.totalDocuments,
      documentsWithEmbedding: result.documentsWithEmbedding,
    };
  }
}
