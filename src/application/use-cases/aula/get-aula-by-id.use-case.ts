import { Injectable, NotFoundException } from '@nestjs/common';
import { AulaRepository } from 'src/infrastructure/database/repositories/aula.repository';

@Injectable()
export class GetAulaByIdUseCase {
  constructor(private readonly aulaRepo: AulaRepository) {}

  async execute(id: number) {
    const aula = await this.aulaRepo.findById(id);
    if (!aula) throw new NotFoundException('Aula não encontrada');
    return aula;
  }
}