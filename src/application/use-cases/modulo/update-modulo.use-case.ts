import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuloRepository } from '../../../infrastructure/database/repositories/modulo.repository';

@Injectable()
export class UpdateModuloUseCase {
  constructor(private readonly moduloRepo: ModuloRepository) {}

  async execute(id: number, data: { nomeModulo?: string; tempoModulo?: number }) {
    const modulo = await this.moduloRepo.findById(id);
    if (!modulo) throw new NotFoundException('Módulo não encontrado');

    return this.moduloRepo.update(id, data);
  }
}