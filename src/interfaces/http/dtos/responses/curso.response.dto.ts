import { CursoModel } from 'src/domain/models/curso.model';
import { ModuloModel } from 'src/domain/models/modulo.model';

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
  modulos?: { // 🔥 Adiciona a lista de módulos resumida
    id: number;
    nomeModulo: string;
    tempoModulo: number;
  }[];

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

    // 🔥 Adiciona a lista de módulos (apenas dados básicos)
    this.modulos = curso.modulos?.map((modulo: ModuloModel) => ({
      id: modulo.id!,
      nomeModulo: modulo.nomeModulo,
      tempoModulo: modulo.tempoModulo,
    }));
  }
}
