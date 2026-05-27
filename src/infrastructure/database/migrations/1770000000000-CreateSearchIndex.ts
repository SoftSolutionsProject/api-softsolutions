import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSearchIndex1770000000000 implements MigrationInterface {
  name = 'CreateSearchIndex1770000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS search_index (
        id SERIAL PRIMARY KEY,
        document_id VARCHAR(64) NOT NULL UNIQUE,
        tipo VARCHAR(16) NOT NULL,
        curso_id INTEGER,
        aula_id INTEGER,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT NOT NULL DEFAULT '',
        descricao_detalhada TEXT NOT NULL DEFAULT '',
        categoria VARCHAR(120) NOT NULL DEFAULT '',
        conteudo TEXT NOT NULL DEFAULT '',
        professor VARCHAR(255) NOT NULL DEFAULT '',
        status VARCHAR(30) NOT NULL DEFAULT 'ativo',
        avaliacao DOUBLE PRECISION,
        imagem_curso TEXT,
        tempo_curso INTEGER,
        modulo VARCHAR(255) NOT NULL DEFAULT '',
        curso VARCHAR(255) NOT NULL DEFAULT '',
        video_url TEXT,
        tempo_aula INTEGER,
        search_text TEXT NOT NULL,
        embedding vector(1536),
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_search_index_tipo
      ON search_index (tipo)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_search_index_curso_id
      ON search_index (curso_id)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_search_index_search_text
      ON search_index
      USING GIN (to_tsvector('portuguese', search_text))
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_search_index_embedding
      ON search_index
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 10)
      WHERE embedding IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS search_index`);
  }
}
