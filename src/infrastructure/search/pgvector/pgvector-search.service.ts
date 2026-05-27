import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CursoEntity } from '../../database/entities/curso.entity';
import { QueryUnderstandingService } from '../nlp/query-understanding.service';
import { SearchItem } from '../interfaces/search-item.interface';

@Injectable()
export class PgVectorSearchService {
  private readonly logger = new Logger(PgVectorSearchService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly queryUnderstanding: QueryUnderstandingService,
  ) {}

  async search(query: string, vector?: number[]): Promise<SearchItem[]> {
    const normalizedQuery = this.normalize(query);
    if (!normalizedQuery) return [];

    const lexicalOnlySql = `
      SELECT
        *,
        ts_rank_cd(to_tsvector('portuguese', search_text), plainto_tsquery('portuguese', $1)) AS lexical_score,
        0::float AS semantic_score
      FROM search_index
      WHERE
        to_tsvector('portuguese', search_text) @@ plainto_tsquery('portuguese', $1)
        OR search_text ILIKE $2
      ORDER BY lexical_score DESC, updated_at DESC
      LIMIT 20
    `;

    const vectorSql = `
      SELECT
        *,
        ts_rank_cd(to_tsvector('portuguese', search_text), plainto_tsquery('portuguese', $2)) AS lexical_score,
        CASE
          WHEN embedding IS NULL THEN 0
          ELSE 1 - (embedding <=> $1::vector)
        END AS semantic_score
      FROM search_index
      WHERE
        embedding IS NOT NULL
        OR to_tsvector('portuguese', search_text) @@ plainto_tsquery('portuguese', $2)
        OR search_text ILIKE $3
      ORDER BY semantic_score DESC, lexical_score DESC, updated_at DESC
      LIMIT 20
    `;

    const rows = vector?.length
      ? await this.dataSource.query(vectorSql, [
          this.toVectorLiteral(vector),
          normalizedQuery,
          `%${normalizedQuery}%`,
        ])
      : await this.dataSource.query(lexicalOnlySql, [
          normalizedQuery,
          `%${normalizedQuery}%`,
        ]);

    return rows.map((row: any) => this.mapRow(row));
  }

  async getSuggestions(query: string): Promise<string[]> {
    const normalizedQuery = this.normalize(query);
    if (!normalizedQuery) return [];

    const rows = await this.dataSource.query(
      `
        SELECT DISTINCT titulo
        FROM search_index
        WHERE search_text ILIKE $1
        ORDER BY titulo ASC
        LIMIT 8
      `,
      [`%${normalizedQuery}%`],
    );

    return rows.map((row: any) => row.titulo);
  }

  async replaceAllDocuments(documents: SearchDocument[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.query('TRUNCATE TABLE search_index RESTART IDENTITY');

      for (const doc of documents) {
        await manager.query(
          `
            INSERT INTO search_index (
              document_id,
              tipo,
              curso_id,
              aula_id,
              titulo,
              descricao,
              descricao_detalhada,
              categoria,
              conteudo,
              professor,
              status,
              avaliacao,
              imagem_curso,
              tempo_curso,
              modulo,
              curso,
              video_url,
              tempo_aula,
              search_text,
              embedding,
              updated_at
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
              $11, $12, $13, $14, $15, $16, $17, $18,
              $19, ${doc.embedding?.length ? '$20::vector' : 'NULL'}, now()
            )
          `,
          [
            doc.id,
            doc.tipo,
            doc.cursoId,
            doc.aulaId,
            doc.titulo,
            doc.descricao,
            doc.descricaoDetalhada ?? '',
            doc.categoria,
            doc.conteudo,
            doc.professor,
            doc.status,
            doc.avaliacao,
            doc.imagemCurso,
            doc.tempoCurso,
            doc.modulo,
            doc.curso,
            doc.videoUrl,
            doc.tempoAula,
            doc.searchText,
            ...(doc.embedding?.length
              ? [this.toVectorLiteral(doc.embedding)]
              : []),
          ],
        );
      }
    });
  }

  async reindexCursosEAulas(): Promise<{
    success: boolean;
    totalDocuments: number;
    documentsWithEmbedding: number;
  }> {
    const cursos = await this.dataSource.getRepository(CursoEntity).find({
      relations: ['modulos', 'modulos.aulas'],
    });

    const documents: SearchDocument[] = [];
    let documentsWithEmbedding = 0;

    for (const curso of cursos) {
      const cursoText = [
        curso.nomeCurso,
        curso.descricaoCurta,
        curso.descricaoDetalhada,
        curso.categoria,
        curso.professor,
      ]
        .filter(Boolean)
        .join(' ');
      const cursoProcessed = await this.queryUnderstanding.process(cursoText);

      if (cursoProcessed.embedding?.length) documentsWithEmbedding++;

      documents.push({
        id: `curso-${curso.id}`,
        tipo: 'curso',
        cursoId: curso.id,
        aulaId: null,
        titulo: curso.nomeCurso,
        descricao: curso.descricaoCurta ?? '',
        descricaoDetalhada: curso.descricaoDetalhada ?? '',
        categoria: curso.categoria ?? '',
        conteudo: curso.descricaoDetalhada ?? '',
        professor: curso.professor ?? '',
        status: curso.status ?? 'ativo',
        avaliacao: curso.avaliacao ?? 0,
        imagemCurso: curso.imagemCurso ?? null,
        tempoCurso: curso.tempoCurso ?? null,
        modulo: '',
        curso: curso.nomeCurso,
        videoUrl: null,
        tempoAula: null,
        searchText: this.buildSearchText([
          curso.nomeCurso,
          curso.descricaoCurta,
          curso.descricaoDetalhada,
          curso.categoria,
          curso.professor,
        ]),
        embedding: cursoProcessed.embedding,
      });

      for (const modulo of curso.modulos ?? []) {
        for (const aula of modulo.aulas ?? []) {
          const aulaText = [
            aula.nomeAula,
            aula.descricaoConteudo,
            modulo.nomeModulo,
            curso.nomeCurso,
            curso.categoria,
          ]
            .filter(Boolean)
            .join(' ');
          const aulaProcessed = await this.queryUnderstanding.process(aulaText);

          if (aulaProcessed.embedding?.length) documentsWithEmbedding++;

          documents.push({
            id: `aula-${aula.id}`,
            tipo: 'aula',
            cursoId: curso.id,
            aulaId: aula.id,
            titulo: aula.nomeAula,
            descricao: aula.descricaoConteudo ?? '',
            descricaoDetalhada: aula.descricaoConteudo ?? '',
            categoria: curso.categoria ?? '',
            conteudo: aula.descricaoConteudo ?? '',
            professor: curso.professor ?? '',
            status: 'ativo',
            avaliacao: curso.avaliacao ?? 0,
            imagemCurso: curso.imagemCurso ?? null,
            tempoCurso: curso.tempoCurso ?? null,
            modulo: modulo.nomeModulo ?? '',
            curso: curso.nomeCurso,
            videoUrl: aula.videoUrl ?? null,
            tempoAula: aula.tempoAula ?? null,
            searchText: this.buildSearchText([
              aula.nomeAula,
              aula.descricaoConteudo,
              modulo.nomeModulo,
              curso.nomeCurso,
              curso.categoria,
              curso.professor,
            ]),
            embedding: aulaProcessed.embedding,
          });
        }
      }
    }

    await this.replaceAllDocuments(documents);

    this.logger.log(`Search index atualizado: ${documents.length} documentos.`);

    return {
      success: true,
      totalDocuments: documents.length,
      documentsWithEmbedding,
    };
  }

  private mapRow(row: any): SearchItem {
    return {
      id: row.document_id,
      tipo: row.tipo,
      cursoId: row.curso_id,
      aulaId: row.aula_id,
      titulo: row.titulo,
      descricao: row.descricao,
      descricaoDetalhada: row.descricao_detalhada,
      categoria: row.categoria,
      tags: [],
      conteudo: row.conteudo,
      professor: row.professor,
      status: row.status,
      avaliacao: row.avaliacao === null ? null : Number(row.avaliacao),
      imagemCurso: row.imagem_curso,
      tempoCurso: row.tempo_curso,
      modulo: row.modulo,
      curso: row.curso,
      videoUrl: row.video_url,
      tempoAula: row.tempo_aula,
      url:
        row.tipo === 'curso'
          ? `/curso/${row.curso_id}`
          : `/curso/${row.curso_id}/aulas`,
      semanticScore:
        Number(row.semantic_score ?? 0) + Number(row.lexical_score ?? 0),
    };
  }

  private normalize(value: string): string {
    return (value ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private buildSearchText(
    parts: Array<string | number | null | undefined>,
  ): string {
    return this.normalize(
      parts.filter((part) => part !== null && part !== undefined).join(' '),
    );
  }

  private toVectorLiteral(vector: number[]): string {
    return `[${vector.map((value) => Number(value).toFixed(8)).join(',')}]`;
  }
}

interface SearchDocument extends SearchItem {
  searchText: string;
  embedding?: number[];
}
