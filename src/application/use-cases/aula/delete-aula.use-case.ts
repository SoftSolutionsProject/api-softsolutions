import { Injectable, NotFoundException } from '@nestjs/common';
import { AulaRepository } from 'src/infrastructure/database/repositories/aula.repository';

@Injectable()
export class DeleteAulaUseCase {
  constructor(private readonly aulaRepo: AulaRepository) {}

  async execute(id: number): Promise<{ message: string }> {
    const aula = await this.aulaRepo.findById(id);
    if (!aula) throw new NotFoundException('Aula não encontrada');
    
    await this.aulaRepo.delete(id);
    return { message: 'Aula removida com sucesso' };
  }
}