import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from '../../../domain/curso/curso.entity';
import { CreateCursoDto } from '../dtos/create-curso.dto';
import { UpdateCursoDto } from '../dtos/update-curso.dto';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}

  async create(data: CreateCursoDto): Promise<Curso> {
    const novo = this.cursoRepository.create(data);
    return this.cursoRepository.save(novo);
  }

  async findAll(): Promise<Curso[]> {
    return this.cursoRepository.find();
  }

  async findOne(id: number): Promise<Curso> {
    const curso = await this.cursoRepository.findOne({
      where: { id },
      relations: ['modulos', 'modulos.aulas'],
    });
  
    if (!curso) throw new NotFoundException('Curso não encontrado');
    return curso;
  } 

  async update(id: number, data: UpdateCursoDto): Promise<Curso> {
    const curso = await this.findOne(id);
    Object.assign(curso, data);
    return this.cursoRepository.save(curso);
  }

  async remove(id: number): Promise<{ message: string }> {
    const curso = await this.findOne(id);
    await this.cursoRepository.remove(curso);
    return { message: 'Curso removido com sucesso' };
  }
}