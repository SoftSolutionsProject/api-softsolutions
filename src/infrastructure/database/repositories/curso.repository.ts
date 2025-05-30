import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CursoEntity } from '../entities/curso.entity';
import { CursoModel } from 'src/domain/models/curso.model';

@Injectable()
export class CursoRepository {
  constructor(
    @InjectRepository(CursoEntity)
    private readonly repo: Repository<CursoEntity>,
  ) {}

  async create(data: Partial<CursoModel>): Promise<CursoModel> {
    const curso = this.repo.create(data);
    return this.repo.save(curso);
  }

 async findById(id: number): Promise<CursoModel | null> {
  return await this.repo.findOne({
    where: { id },
    relations: [
      'modulos',  
      'modulos.aulas',
    ],
  });
}
  async findAll(): Promise<CursoModel[]> {
    return await this.repo.find();
  }

  async update(id: number, data: Partial<CursoModel>): Promise<CursoModel> {
    await this.repo.update(id, data);
    return (await this.findById(id))!;
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}