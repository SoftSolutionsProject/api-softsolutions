import { ApiProperty } from '@nestjs/swagger';
import { SearchResultModel } from 'src/application/use-cases/search/search-cursos.use-case';

export class SearchResultDto {
  @ApiProperty()
  cursoId: number;

  @ApiProperty()
  nomeCurso: string;

  @ApiProperty()
  professor: string;

  @ApiProperty()
  categoria: string;

  @ApiProperty()
  avaliacao: number;

  @ApiProperty()
  imagemCurso: string;

  @ApiProperty()
  resumo: string;

  @ApiProperty()
  score: number;

  @ApiProperty({ type: [String] })
  termosRelacionados: string[];

  constructor(model: SearchResultModel) {
    this.cursoId = model.id;
    this.nomeCurso = model.nomeCurso;
    this.professor = model.professor;
    this.categoria = model.categoria;
    this.avaliacao = model.avaliacao;
    this.imagemCurso = model.imagemCurso;
    this.resumo = model.resumo;
    this.score = model.score;
    this.termosRelacionados = model.matchedTerms;
  }
}
