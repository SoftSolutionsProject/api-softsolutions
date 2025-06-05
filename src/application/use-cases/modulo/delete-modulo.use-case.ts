import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuloRepository } from '../../../infrastructure/database/repositories/modulo.repository';

@Injectable()
export class DeleteModuloUseCase {
  constructor(private readonly moduloRepo: ModuloRepository) {}

  async execute(id: number): Promise<{ message: string }> {
    const moduloExistente = await this.moduloRepo.findById(id);
    if (!moduloExistente) {
      throw new NotFoundException('Módulo não encontrado');
    }
    
    await this.moduloRepo.delete(id);
    return { message: 'Módulo removido com sucesso' };
  }
}