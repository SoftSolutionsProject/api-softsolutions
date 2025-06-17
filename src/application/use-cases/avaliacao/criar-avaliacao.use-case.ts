import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { AvaliacaoRepository } from '../../../infrastructure/database/repositories/avaliacao.repository';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { CertificadoRepository } from '../../../infrastructure/database/repositories/certificado.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import { CreateAvaliacaoDto } from 'src/interfaces/http/dtos/requests/create-avaliacao.dto';
import { AvaliacaoModel } from '../../../domain/models/avaliacao.model';

@Injectable()
export class CriarAvaliacaoUseCase {
  constructor(
    private readonly avaliacaoRepo: AvaliacaoRepository,
    private readonly inscricaoRepo: InscricaoRepository,
    private readonly certificadoRepo: CertificadoRepository,
    private readonly cursoRepo: CursoRepository,
    private readonly usuarioRepo: UsuarioRepository
  ) {}

  async execute(userId: number, dto: CreateAvaliacaoDto): Promise<AvaliacaoModel> {
    const usuario = await this.usuarioRepo.findById(userId);
    if (!usuario || usuario.tipo !== 'aluno') {
      throw new ForbiddenException('Apenas alunos podem criar avaliações.');
    }

    const inscricao = await this.inscricaoRepo.findByUsuarioAndCurso(userId, dto.cursoId);
    if (!inscricao) throw new ForbiddenException('Você não está inscrito neste curso.');

    const certificado = await this.certificadoRepo.findByInscricao(inscricao);
    if (!certificado) throw new ForbiddenException('Você só pode avaliar após gerar o certificado.');

    const existente = await this.avaliacaoRepo.findByUserAndCourse(userId, dto.cursoId);
    if (existente) throw new BadRequestException('Você já avaliou este curso.');

    const curso = await this.cursoRepo.findById(dto.cursoId);
    if (!curso) throw new BadRequestException('Curso não encontrado.');

    const salvo = await this.avaliacaoRepo.create({
      nota: dto.nota,
      comentario: dto.comentario ?? '',
      usuarioId: userId, // 🔑 SEM FIXAR 1
      cursoId: dto.cursoId
    });

    const media = await this.avaliacaoRepo.getCourseAverage(dto.cursoId);
    await this.cursoRepo.update(dto.cursoId, { avaliacao: media });

    return this.avaliacaoRepo.toModel(salvo);
  }
}
