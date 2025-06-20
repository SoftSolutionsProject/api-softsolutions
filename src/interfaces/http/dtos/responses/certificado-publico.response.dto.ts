import { ApiProperty } from '@nestjs/swagger';

export class CertificadoPublicoResponseDto {
  @ApiProperty()
  numeroSerie: string;

  @ApiProperty()
  aluno: string;

  @ApiProperty()
  curso: string;

  @ApiProperty()
  cargaHoraria: number;

  @ApiProperty()
  dataEmissao: Date;

  constructor(certificado: {
    numeroSerie: string;
    usuario: { nomeUsuario: string };
    curso: { nomeCurso: string; tempoCurso: number };
    dataEmissao: Date;
  }) {
    this.numeroSerie = certificado.numeroSerie;
    this.aluno = certificado.usuario.nomeUsuario;
    this.curso = certificado.curso.nomeCurso;
    this.cargaHoraria = certificado.curso.tempoCurso;
    this.dataEmissao = certificado.dataEmissao;
  }
}
