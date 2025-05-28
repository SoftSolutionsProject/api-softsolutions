import { CursoModel } from 'src/domain/models/curso.model';

export class CursoResponseDto {
  id: number;
  nome: string;
  tempo: number;
  descricaoCurta: string;
  professor: string;
  categoria: string;
  status: string;
  avaliacao: number;
  imagem: string;

  constructor(curso: CursoModel) {
    this.id = curso.id!;
    this.nome = curso.nomeCurso;
    this.tempo = curso.tempoCurso;
    this.descricaoCurta = curso.descricaoCurta;
    this.professor = curso.professor;
    this.categoria = curso.categoria;
    this.status = curso.status;
    this.avaliacao = curso.avaliacao;
    this.imagem = curso.imagemCurso;
  }
}