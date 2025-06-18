import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AvaliacaoRepository } from '../../../infrastructure/database/repositories/avaliacao.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { UpdateAvaliacaoDto } from 'src/interfaces/http/dtos/requests/update-avaliacao.dto';

@Injectable()
export class AtualizarAvaliacaoUseCase {
  constructor(
    private readonly avaliacaoRepo: AvaliacaoRepository,
    private readonly cursoRepo: CursoRepository,
  ) {}

  async execute(userId: number, avaliacaoId: number, dto: UpdateAvaliacaoDto) {
    const entity = await this.avaliacaoRepo.findById(avaliacaoId);
    if (!entity) throw new NotFoundException('Avaliação não encontrada.');
    if (entity.usuario.id !== userId) throw new ForbiddenException('Você só pode editar sua própria avaliação.');

    entity.nota = dto.nota;
    entity.comentario = dto.comentario ?? '';

    const salvo = await this.avaliacaoRepo.save(entity);

    const media = await this.avaliacaoRepo.getCourseAverage(entity.curso.id);
    await this.cursoRepo.update(entity.curso.id, { avaliacao: media });

    return this.avaliacaoRepo.toModel(salvo);
  }
}
