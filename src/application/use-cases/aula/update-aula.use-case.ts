import { Injectable, NotFoundException } from '@nestjs/common';
import { AulaRepository } from 'src/infrastructure/database/repositories/aula.repository';
import { UpdateAulaDto } from 'src/interfaces/http/dtos/requests/update-aula.dto';

@Injectable()
export class UpdateAulaUseCase {
  constructor(private readonly aulaRepo: AulaRepository) {}

  async execute(id: number, dto: UpdateAulaDto) {
    const aula = await this.aulaRepo.findById(id);
    if (!aula) throw new NotFoundException('Aula não encontrada');

    const updatedData = {
      ...aula,
      ...dto
    };

    return this.aulaRepo.update(id, updatedData);
  }
}