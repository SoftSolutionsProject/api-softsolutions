import { Injectable } from '@nestjs/common';
import { AulaRepository } from 'src/infrastructure/database/repositories/aula.repository';

@Injectable()
export class ListAulaUseCase {
  constructor(private readonly aulaRepo: AulaRepository) {}

  async execute() {
    return this.aulaRepo.findAll();
  }
}