import { Module } from '@nestjs/common';
import { SearchController } from '../interfaces/http/controllers/search.controller';
import { SearchTextUseCase } from '../application/use-cases/search/search-text.use-case';
import { SearchVoiceUseCase } from '../application/use-cases/search/search-voice.use-case';
import { QueryUnderstandingService } from '../infrastructure/search/nlp/query-understanding.service';
import { PgVectorSearchService } from '../infrastructure/search/pgvector/pgvector-search.service';
import { OpenAiGatewayService } from '../infrastructure/shared/openai-gateway.service';

@Module({
  controllers: [SearchController],
  providers: [
    OpenAiGatewayService,
    QueryUnderstandingService,
    PgVectorSearchService,
    SearchTextUseCase,
    SearchVoiceUseCase,
  ],
  exports: [
    OpenAiGatewayService,
    QueryUnderstandingService,
    PgVectorSearchService,
    SearchTextUseCase,
    SearchVoiceUseCase,
  ],
})
export class SearchModule {}
