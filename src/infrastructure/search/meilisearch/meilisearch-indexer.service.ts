import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeilisearchService } from './meilisearch.service';
import { CursoEntity } from '../../database/entities/curso.entity';
import { SearchItem } from '../interfaces/search-item.interface';

@Injectable()
export class MeilisearchIndexerService {
  private readonly logger = new Logger(MeilisearchIndexerService.name);

  constructor(
    @InjectRepository(CursoEntity)
    private readonly cursoRepository: Repository<CursoEntity>,
    private readonly meilisearchService: MeilisearchService,
  ) {}

  async reindexCursosEAulas(): Promise<void> {
    const cursos = await this.cursoRepository.find({
      relations: ['modulos', 'modulos.aulas'],
    });

    const cursoDocs: SearchItem[] = cursos.map((curso) => ({
      id: `curso-${curso.id}`,
      tipo: 'curso',
      cursoId: curso.id,
      aulaId: null,
      titulo: curso.nomeCurso,
      descricao: `${curso.descricaoCurta || ''} ${curso.descricaoDetalhada || ''}`.trim(),
      categoria: curso.categoria || '',
      tags: [
        curso.categoria,
        curso.professor,
        ...(curso.modulos?.map((modulo) => modulo.nomeModulo) || []),
      ].filter(Boolean) as string[],
      conteudo: [
        curso.nomeCurso,
        curso.descricaoCurta,
        curso.descricaoDetalhada,
        curso.professor,
        curso.categoria,
        ...(curso.modulos?.map((modulo) => modulo.nomeModulo) || []),
        ...(curso.modulos?.flatMap(
          (modulo) => modulo.aulas?.map((aula) => aula.nomeAula) || [],
        ) || []),
      ]
        .filter(Boolean)
        .join(' '),
      professor: curso.professor || '',
      status: curso.status || '',
      avaliacao: curso.avaliacao ?? null,
      imagemCurso: curso.imagemCurso || '',
      tempoCurso: curso.tempoCurso ?? null,
      modulo: '',
      curso: curso.nomeCurso,
      videoUrl: '',
      tempoAula: null,
    }));

    const aulaDocs: SearchItem[] = cursos.flatMap((curso) =>
      (curso.modulos || []).flatMap((modulo) =>
        (modulo.aulas || []).map((aula) => ({
          id: `aula-${aula.id}`,
          tipo: 'aula',
          cursoId: curso.id,
          aulaId: aula.id,
          titulo: aula.nomeAula,
          descricao: aula.descricaoConteudo || '',
          categoria: curso.categoria || '',
          tags: [
            curso.categoria,
            curso.professor,
            modulo.nomeModulo,
            ...(Array.isArray(aula.materialApoio) ? aula.materialApoio : []),
          ].filter(Boolean) as string[],
          conteudo: [
            aula.nomeAula,
            aula.descricaoConteudo,
            modulo.nomeModulo,
            curso.nomeCurso,
            curso.descricaoCurta,
            curso.descricaoDetalhada,
            curso.categoria,
            curso.professor,
            ...(Array.isArray(aula.materialApoio) ? aula.materialApoio : []),
          ]
            .filter(Boolean)
            .join(' '),
          professor: curso.professor || '',
          status: curso.status || '',
          avaliacao: curso.avaliacao ?? null,
          imagemCurso: curso.imagemCurso || '',
          tempoCurso: curso.tempoCurso ?? null,
          modulo: modulo.nomeModulo || '',
          curso: curso.nomeCurso,
          videoUrl: aula.videoUrl || '',
          tempoAula: aula.tempoAula ?? null,
        })),
      ),
    );

    const documents = [...cursoDocs, ...aulaDocs];

    if (!documents.length) {
      this.logger.warn('Nenhum curso ou aula encontrado para indexação.');
      return;
    }

    await this.meilisearchService.replaceAllDocuments(documents);

    this.logger.log(
      `Indexação concluída: ${cursoDocs.length} cursos e ${aulaDocs.length} aulas enviados ao Meilisearch.`,
    );
  }
}