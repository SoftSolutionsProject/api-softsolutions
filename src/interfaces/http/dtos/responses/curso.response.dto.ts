import { ApiProperty } from '@nestjs/swagger';
import { CursoModel } from 'src/domain/models/curso.model';
import { ModuloModel } from 'src/domain/models/modulo.model';
import { AulaModel } from 'src/domain/models/aula.model';

export class CursoResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nomeCurso: string;

  @ApiProperty()
  tempoCurso: number;

  @ApiProperty()
  descricaoCurta: string;

  @ApiProperty()
  professor: string;

  @ApiProperty()
  categoria: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  avaliacao: number;

  @ApiProperty()
  imagemCurso: string;

  @ApiProperty({
    required: false,
    type: [Object],
  })
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
