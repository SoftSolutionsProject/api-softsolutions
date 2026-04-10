import { Injectable } from '@nestjs/common';
import { CursoRepository } from 'src/infrastructure/database/repositories/curso.repository';
import { SemanticDocumentBuilder } from '../../services/search/semantic-document.builder';
import { SimpleSimilarityEngine } from '../../services/search/simple-similarity.engine';

export interface SearchResultModel {
  id: number;
  nomeCurso: string;
  professor: string;
  categoria: string;
  avaliacao: number;
  imagemCurso: string;
  resumo: string;
  score: number;
  matchedTerms: string[];
}

@Injectable()
export class SearchCursosUseCase {
  constructor(
    private readonly cursoRepository: CursoRepository,
    private readonly documentBuilder: SemanticDocumentBuilder,
    private readonly similarityEngine: SimpleSimilarityEngine,
  ) {}

  async execute(query: string): Promise<SearchResultModel[]> {
    const sanitizedQuery = query?.trim();
    if (!sanitizedQuery) return [];

    const cursos = await this.cursoRepository.findAllWithModulosEAulas();
    if (!cursos.length) return [];

    const documents = cursos.map((curso) => this.documentBuilder.build(curso));
    const ranked = this.similarityEngine.rank(sanitizedQuery, documents).slice(0, 5);

    return ranked.map((result) => ({
      id: result.curso.id ?? 0,
      nomeCurso: result.curso.nomeCurso,
      professor: result.curso.professor,
      categoria: result.curso.categoria,
      avaliacao: result.curso.avaliacao,
      imagemCurso: result.curso.imagemCurso,
      resumo: result.curso.descricaoCurta,
      score: Number(result.score.toFixed(4)),
      matchedTerms: Array.from(new Set(result.matchedTerms)),
    }));
  }
}
