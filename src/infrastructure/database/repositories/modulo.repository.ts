import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ModuloEntity } from '../entities/modulo.entity';
import { ModuloModel } from 'src/domain/models/modulo.model';

@Injectable()
export class ModuloRepository {
  constructor(
    @InjectRepository(ModuloEntity)
    private readonly repo: Repository<ModuloEntity>,
  ) {}

  async create(data: Partial<ModuloModel>): Promise<ModuloModel> {
    const modulo = this.repo.create(data);
    return this.repo.save(modulo);
  }

  async findById(id: number): Promise<ModuloModel | null> {
    return await this.repo.findOne({ 
      where: { id },
      relations: ['curso']
    });
  }

  async findAll(): Promise<ModuloModel[]> {
    return await this.repo.find({ relations: ['curso'] });
  }

  async update(id: number, data: Partial<ModuloModel>): Promise<ModuloModel> {
    await this.repo.update(id, data);
    return (await this.findById(id))!;
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}