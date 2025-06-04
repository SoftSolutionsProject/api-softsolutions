import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InscricaoEntity } from '../entities/inscricao.entity';
import { InscricaoModel } from 'src/domain/models/inscricao.model';

@Injectable()
export class InscricaoRepository {
  constructor(
    @InjectRepository(InscricaoEntity)
    private readonly repo: Repository<InscricaoEntity>,
  ) {}

  async create(data: Partial<InscricaoModel>): Promise<InscricaoModel> {
    const inscricao = this.repo.create(data);
    return this.repo.save(inscricao);
  }

  async findById(id: number): Promise<InscricaoModel | null> {
  return this.repo.findOne({ 
    where: { id },
    relations: [
      'usuario',
      'curso',
      'curso.modulos',
      'curso.modulos.aulas',
      'progressoAulas',
      'progressoAulas.aula'
    ]
  });
}

  async findByUsuarioAndCurso(idUsuario: number, idCurso: number): Promise<InscricaoModel | null> {
    return this.repo.findOne({ 
      where: { 
        usuario: { id: idUsuario },
        curso: { id: idCurso }
      },
      relations: ['usuario', 'curso']
    });
  }

  async findByUsuario(idUsuario: number): Promise<InscricaoModel[]> {
    return this.repo.find({ 
      where: { usuario: { id: idUsuario } },
      relations: ['curso', 'progressoAulas', 'progressoAulas.aula']
    });
  }

  async update(id: number, data: Partial<InscricaoModel>): Promise<InscricaoModel> {
    await this.repo.update(id, data);
    return (await this.findById(id))!;
  }

  async simpleUpdate(id: number, data: Partial<InscricaoModel>): Promise<void> {
  await this.repo.update(id, data);
}
}