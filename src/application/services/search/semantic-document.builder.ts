import { Injectable } from '@nestjs/common';
import { CursoModel } from 'src/domain/models/curso.model';
import { ModuloModel } from 'src/domain/models/modulo.model';
import { AulaModel } from 'src/domain/models/aula.model';

export interface SemanticDocument {
  curso: CursoModel;
  text: string;
}

@Injectable()
export class SemanticDocumentBuilder {
  build(curso: CursoModel): SemanticDocument {
    const lines: string[] = [
      `Curso: ${curso.nomeCurso ?? ''}`.trim(),
      `Resumo: ${curso.descricaoCurta ?? ''}`.trim(),
      `Descrição: ${curso.descricaoDetalhada ?? ''}`.trim(),
      `Instrutor: ${curso.professor ?? ''}`.trim(),
      `Categoria: ${curso.categoria ?? ''}`.trim(),
    ];

    const moduleBlocks = (curso.modulos ?? [])
      .map((modulo) => this.buildModuleBlock(modulo))
      .filter(Boolean);

    if (moduleBlocks.length) {
      lines.push('', ...moduleBlocks);
    }

    return {
      curso,
      text: lines.join('\n').trim(),
    };
  }

  private buildModuleBlock(modulo: ModuloModel): string {
    const blockLines: string[] = [`[Módulo] ${modulo.nomeModulo ?? ''}`.trim()];

    const lessons = (modulo.aulas ?? [])
      .map((aula) => this.buildLessonBlock(aula))
      .filter(Boolean);

    blockLines.push(...lessons);

    return blockLines.join('\n').trim();
  }

  private buildLessonBlock(aula: AulaModel): string {
    const lessonLines = [
      `  - Aula: ${aula.nomeAula ?? ''}`.trimEnd(),
      `    Conteúdo: ${aula.descricaoConteudo ?? ''}`.trimEnd(),
    ];

    if (aula.materialApoio?.length) {
      lessonLines.push(`    Materiais: ${aula.materialApoio.join(', ')}`.trimEnd());
    }

    return lessonLines.join('\n');
  }
}
