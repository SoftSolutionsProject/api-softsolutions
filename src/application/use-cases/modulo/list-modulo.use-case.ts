import { Injectable } from '@nestjs/common';
import { ModuloRepository } from '../../../infrastructure/database/repositories/modulo.repository';

@Injectable()
export class ListModuloUseCase {
  constructor(private readonly moduloRepo: ModuloRepository) {}

  async execute() {
    return this.moduloRepo.findAll();
  }
}