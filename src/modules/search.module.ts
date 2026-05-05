import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SearchController } from '../interfaces/http/controllers/search.controller';
import { MeilisearchService } from '../infrastructure/search/meilisearch/meilisearch.service';
import { MeilisearchIndexerService } from '../infrastructure/search/meilisearch/meilisearch-indexer.service';
import { IntentClassifierService } from '../infrastructure/search/nlp/intent-classifier.service';

import { SearchTextUseCase } from '../application/use-cases/search/search-text.use-case';
import { SearchVoiceUseCase } from '../application/use-cases/search/search-voice.use-case';

import { CursoEntity } from '../infrastructure/database/entities/curso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CursoEntity])],
  controllers: [SearchController],
  providers: [
    MeilisearchService,
    MeilisearchIndexerService,
    IntentClassifierService,
    SearchTextUseCase,
    SearchVoiceUseCase,
  ],
  exports: [
    MeilisearchService,
    MeilisearchIndexerService,
    SearchTextUseCase,
    SearchVoiceUseCase,
  ],
})
export class SearchModule {}