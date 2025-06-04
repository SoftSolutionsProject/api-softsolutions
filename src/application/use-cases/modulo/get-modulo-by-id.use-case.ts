import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuloRepository } from '../../../infrastructure/database/repositories/modulo.repository';

@Injectable()
export class GetModuloByIdUseCase {
  constructor(private readonly moduloRepo: ModuloRepository) {}

  async execute(id: number) {
    const modulo = await this.moduloRepo.findById(id);
    if (!modulo) throw new NotFoundException('Módulo não encontrado');
    return modulo;
  }
}