import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AulaRepository } from 'src/infrastructure/database/repositories/aula.repository';
import { ModuloRepository } from 'src/infrastructure/database/repositories/modulo.repository';
import { CreateAulaDto } from 'src/interfaces/http/dtos/requests/create-aula.dto';

@Injectable()
export class CreateAulaUseCase {
  constructor(
    private readonly aulaRepo: AulaRepository,
    private readonly moduloRepo: ModuloRepository,
  ) {}

  async execute(dto: CreateAulaDto) {
    const modulo = await this.moduloRepo.findById(dto.idModulo);
    if (!modulo) throw new NotFoundException('Módulo não encontrado');

    return this.aulaRepo.create({
      nomeAula: dto.nomeAula,
      tempoAula: dto.tempoAula,
      videoUrl: dto.videoUrl,
      materialApoio: dto.materialApoio,
      descricaoConteudo: dto.descricaoConteudo,
      modulo,
    });
  }
}