import { Injectable, NotFoundException } from '@nestjs/common';
import { AulaRepository } from 'src/infrastructure/database/repositories/aula.repository';
import { ModuloRepository } from 'src/infrastructure/database/repositories/modulo.repository';

@Injectable()
export class ListAulaByModuloUseCase {
  constructor(
    private readonly aulaRepo: AulaRepository,
    private readonly moduloRepo: ModuloRepository,
  ) {}

  async execute(idModulo: number) {
    const modulo = await this.moduloRepo.findById(idModulo);
    if (!modulo) throw new NotFoundException('Módulo não encontrado');
    
    return this.aulaRepo.findByModulo(idModulo);
  }
}