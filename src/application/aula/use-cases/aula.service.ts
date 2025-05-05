import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aula } from '../../../domain/aula/aula.entity';
import { Modulo } from '../../../domain/modulo/modulo.entity';
import { CreateAulaDto } from '../dtos/create-aula.dto';
import { UpdateAulaDto } from '../dtos/update-aula.dto';

@Injectable()
export class AulaService {
  constructor(
    @InjectRepository(Aula)
    private readonly aulaRepo: Repository<Aula>,
    @InjectRepository(Modulo)
    private readonly moduloRepo: Repository<Modulo>,
  ) {}

  async create(dto: CreateAulaDto): Promise<Aula> {
    const modulo = await this.moduloRepo.findOne({ where: { id: dto.idModulo } });
    if (!modulo) throw new NotFoundException('Módulo não encontrado');

    const aula = this.aulaRepo.create({
      nomeAula: dto.nomeAula,
      tempoAula: dto.tempoAula,
      videoUrl: dto.videoUrl,
      materialApoio: dto.materialApoio,
      descricaoConteudo: dto.descricaoConteudo,
      modulo,
    });
    return this.aulaRepo.save(aula);
  }

  async findAll(): Promise<Aula[]> {
    return this.aulaRepo.find({ relations: ['modulo'] });
  }

  async findOne(id: number): Promise<Aula> {
    const aula = await this.aulaRepo.findOne({ where: { id }, relations: ['modulo'] });
    if (!aula) throw new NotFoundException('Aula não encontrada');
    return aula;
  }

  async update(id: number, dto: UpdateAulaDto): Promise<Aula> {
    const aula = await this.findOne(id);
    Object.assign(aula, dto);
    return this.aulaRepo.save(aula);
  }

  async remove(id: number): Promise<{ message: string }> {
    const resultado = await this.aulaRepo.delete(id);
    if (!resultado.affected) throw new NotFoundException('Aula não encontrada');
    return { message: 'Aula removida com sucesso' };
  }

  async findByModulo(idModulo: number): Promise<Aula[]> {
    return this.aulaRepo.find({ 
      where: { modulo: { id: idModulo } },
      relations: ['modulo']
    });
  }
  
  async findByCurso(idCurso: number): Promise<Aula[]> {
    return this.aulaRepo.find({
      where: { modulo: { curso: { id: idCurso } } },
      relations: ['modulo', 'modulo.curso']
    });
  }
}