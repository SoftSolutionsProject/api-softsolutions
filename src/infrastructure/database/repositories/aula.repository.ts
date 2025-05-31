import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AulaEntity } from '../entities/aula.entity';
import { AulaModel } from 'src/domain/models/aula.model';

@Injectable()
export class AulaRepository {
  constructor(
    @InjectRepository(AulaEntity)
    private readonly repo: Repository<AulaEntity>,
  ) {}

  async create(data: Partial<AulaModel>): Promise<AulaModel> {
    const aula = this.repo.create(data);
    return this.repo.save(aula);
  }

  async findById(id: number): Promise<AulaModel | null> {
    return this.repo.findOne({ 
      where: { id },
      relations: ['modulo'] 
    });
  }

  async findAll(): Promise<AulaModel[]> {
    return this.repo.find({ relations: ['modulo'] });
  }

  async update(id: number, data: Partial<AulaModel>): Promise<AulaModel> {
    await this.repo.update(id, data);
    return (await this.findById(id))!;
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findByModulo(idModulo: number): Promise<AulaModel[]> {
    return this.repo.find({ 
      where: { modulo: { id: idModulo } },
      relations: ['modulo']
    });
  }

  async findByCurso(idCurso: number): Promise<AulaModel[]> {
    return this.repo.find({
      where: { modulo: { curso: { id: idCurso } } },
      relations: ['modulo', 'modulo.curso']
    });
  }

  async findByIdWithModuloAndCurso(id: number): Promise<AulaModel | null> {
  return this.repo.findOne({
    where: { id },
    relations: ['modulo', 'modulo.curso']
  });
}
}