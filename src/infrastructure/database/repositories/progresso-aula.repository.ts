import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgressoAulaEntity } from '../entities/progresso-aula.entity';
import { ProgressoAulaModel } from 'src/domain/models/progresso-aula.model';

@Injectable()
export class ProgressoAulaRepository {
  constructor(
    @InjectRepository(ProgressoAulaEntity)
    private readonly repo: Repository<ProgressoAulaEntity>,
  ) {}

  async create(data: Partial<ProgressoAulaModel>): Promise<ProgressoAulaModel> {
    const progresso = this.repo.create(data);
    return this.repo.save(progresso);
  }

  async createMany(data: Partial<ProgressoAulaModel>[]): Promise<ProgressoAulaModel[]> {
    const progressos = this.repo.create(data);
    return this.repo.save(progressos);
  }

  async findByInscricaoAndAula(idInscricao: number, idAula: number): Promise<ProgressoAulaModel | null> {
    return this.repo.findOne({ 
      where: { 
        inscricao: { id: idInscricao },
        aula: { id: idAula }
      },
      relations: ['inscricao', 'aula']
    });
  }

  async update(id: number, data: Partial<ProgressoAulaModel>): Promise<ProgressoAulaModel> {
    await this.repo.update(id, data);
    return (await this.repo.findOne({ where: { id } }))!;
  }

  async countConcluidasByInscricao(idInscricao: number): Promise<number> {
    return this.repo.count({ 
      where: { 
        inscricao: { id: idInscricao },
        concluida: true
      }
    });
  }
}