import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SearchItem } from '../interfaces/search-item.interface';

@Injectable()
export class MeilisearchService implements OnModuleInit {
  private readonly logger = new Logger(MeilisearchService.name);
  private client: any;
  private index: any;
  private readonly indexUid = 'softsolutions';

  async onModuleInit() {
    const host = process.env.MEILI_HOST || 'http://127.0.0.1:7700';
    const apiKey = process.env.MEILI_API_KEY || undefined;

    this.logger.log(`Inicializando Meilisearch com host: ${host}`);
    this.logger.log(`Index UID configurado: ${this.indexUid}`);
    this.logger.log(`API key configurada: ${apiKey ? 'sim' : 'não'}`);

    try {
      const meiliPkg = await new Function(`return import('meilisearch')`)();

      const MeiliSearchClient =
        meiliPkg.MeiliSearch ||
        meiliPkg.Meilisearch ||
        meiliPkg.default?.MeiliSearch ||
        meiliPkg.default?.Meilisearch ||
        meiliPkg.default;

      if (!MeiliSearchClient) {
        throw new Error('Não foi possível carregar o client do pacote meilisearch.');
      }

      this.client = new MeiliSearchClient({
        host,
        apiKey,
      });

      const health = await this.client.health();
      this.logger.log(`Meilisearch online. Status: ${health?.status ?? 'unknown'}`);

      this.index = this.client.index(this.indexUid);
      await this.configureIndex();

      this.logger.log(`Meilisearch inicializado com sucesso para o índice "${this.indexUid}".`);
    } catch (error: any) {
      this.logger.error(
        `Erro ao inicializar Meilisearch: ${error?.message || error}`,
        error?.stack,
      );
      this.index = null;
    }
  }

  private async configureIndex() {
    if (!this.index) {
      throw new Error('Índice do Meilisearch não foi inicializado.');
    }

    await this.index.updateSearchableAttributes([
      'titulo',
      'curso',
      'modulo',
      'descricao',
      'categoria',
      'tags',
      'conteudo',
      'professor',
    ]);

    await this.index.updateDisplayedAttributes([
      'id',
      'tipo',
      'cursoId',
      'aulaId',
      'titulo',
      'descricao',
      'categoria',
      'tags',
      'conteudo',
      'professor',
      'status',
      'avaliacao',
      'imagemCurso',
      'tempoCurso',
      'modulo',
      'curso',
      'videoUrl',
      'tempoAula',
    ]);

    await this.index.updateFilterableAttributes([
      'tipo',
      'cursoId',
      'aulaId',
      'categoria',
      'status',
    ]);

    await this.index.updateSortableAttributes([
      'titulo',
      'avaliacao',
      'tempoCurso',
      'tempoAula',
    ]);

    await this.index.updateSynonyms({
      js: ['javascript'],
      javascript: ['js'],
      frontend: ['front-end', 'front end'],
      backend: ['back-end', 'back end'],
      ia: ['inteligencia artificial', 'inteligência artificial'],
      banco: ['database', 'bd'],
      curso: ['aula', 'treinamento'],
      aula: ['curso', 'lição'],
      reactnative: ['react native', 'react-native'],
      'react native': ['reactnative', 'react-native'],
    });

    await this.index.updateStopWords([
      'de',
      'da',
      'do',
      'das',
      'dos',
      'a',
      'o',
      'e',
      'para',
      'com',
      'um',
      'uma',
      'em',
    ]);
  }

  async search(query: string): Promise<SearchItem[]> {
    if (!this.index || !query?.trim()) {
      return [];
    }

    try {
      const result = await this.index.search(query.trim(), { limit: 10 });
      return (result?.hits as SearchItem[]) || [];
    } catch (error: any) {
      this.logger.error(
        `Erro ao buscar no Meilisearch. Query: "${query}". Motivo: ${error?.message || error}`,
        error?.stack,
      );
      return [];
    }
  }

  async replaceAllDocuments(documents: SearchItem[]) {
    if (!this.index) {
      throw new Error('Índice do Meilisearch não está inicializado.');
    }

    this.logger.log(`Indexando ${documents.length} documentos no índice ${this.indexUid}.`);

    await this.index.deleteAllDocuments();
    await this.index.addDocuments(documents, { primaryKey: 'id' });

    this.logger.log('Documentos enviados para indexação com sucesso.');
  }
}