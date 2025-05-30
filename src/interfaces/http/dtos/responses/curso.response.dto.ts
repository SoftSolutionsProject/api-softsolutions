import { CursoModel } from 'src/domain/models/curso.model';
import { ModuloModel } from 'src/domain/models/modulo.model';
import { AulaModel } from 'src/domain/models/aula.model';

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
  modulos?: {
    id: number;
    nomeModulo: string;
    tempoModulo: number;
    aulas?: {
      id: number;
      nomeAula: string;
      tempoAula: number;
    }[];
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

    this.modulos = curso.modulos?.map((modulo: ModuloModel) => ({
      id: modulo.id!,
      nomeModulo: modulo.nomeModulo,
      tempoModulo: modulo.tempoModulo,
      aulas: modulo.aulas?.map((aula: AulaModel) => ({
        id: aula.id!,
        nomeAula: aula.nomeAula,
        tempoAula: aula.tempoAula,
      })),
    }));
  }
}
