import { CursoModel } from 'src/domain/models/curso.model';

export class CursoResponseDto {
  id: number;
  nomeCurso: string;
  tempoCurso: number;
  descricaoCurta: string;
  professor: string;
  categoria: string;
  status: string;
  avaliacao: number;
  imagemCurso: string;

  constructor(curso: CursoModel) {
    this.id = curso.id!;
    this.nomeCurso = curso.nomeCurso;
    this.tempoCurso = curso.tempoCurso;
    this.descricaoCurta = curso.descricaoCurta;
    this.professor = curso.professor;
    this.categoria = curso.categoria;
    this.status = curso.status;
    this.avaliacao = curso.avaliacao;
    this.imagemCurso = curso.imagemCurso;
  }
}