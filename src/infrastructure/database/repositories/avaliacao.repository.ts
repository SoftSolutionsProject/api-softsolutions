import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvaliacaoEntity } from '../entities/avaliacao.entity';
import { AvaliacaoModel } from '../../../domain/models/avaliacao.model';
import { UsuarioRepository } from './usuario.repository';
import { CursoRepository } from './curso.repository';

@Injectable()
export class AvaliacaoRepository {
  constructor(
    @InjectRepository(AvaliacaoEntity)
    private readonly repo: Repository<AvaliacaoEntity>,
    private readonly usuarioRepo: UsuarioRepository,
    private readonly cursoRepo: CursoRepository,
  ) {}

  async create(data: { nota: number, comentario: string, usuarioId: number, cursoId: number }): Promise<AvaliacaoEntity> {
    const usuario = await this.usuarioRepo.findById(data.usuarioId);
    const curso = await this.cursoRepo.findById(data.cursoId);

    if (!usuario || !curso) throw new Error('Usuário ou curso inválido.');

    const entity = this.repo.create({
      nota: data.nota,
      comentario: data.comentario,
      usuario: usuario as any,
      curso: curso as any,
    });
    return this.repo.save(entity);
  }

  async findById(id: number): Promise<AvaliacaoEntity | null> {
    return this.repo.findOne({ where: { id }, relations: ['usuario', 'curso'] });
  }

  async findByUserAndCourse(usuarioId: number, cursoId: number): Promise<AvaliacaoModel | null> {
    const entity = await this.repo.findOne({
      where: { usuario: { id: usuarioId }, curso: { id: cursoId } },
      relations: ['usuario', 'curso'],
    });
    return entity ? this.toModel(entity) : null;
  }

  async getCourseAverage(cursoId: number): Promise<number> {
    const { avg } = await this.repo.createQueryBuilder('a')
      .select('AVG(a.nota)', 'avg')
      .where('a.cursoId = :cursoId', { cursoId })
      .getRawOne();
    return parseFloat(avg) || 0;
  }

  async save(entity: AvaliacaoEntity): Promise<AvaliacaoEntity> {
    return this.repo.save(entity);
  }

  toModel(entity: AvaliacaoEntity): AvaliacaoModel {
    return {
      id: entity.id,
      nota: entity.nota,
      comentario: entity.comentario,
      criadoEm: entity.criadoEm,
      atualizadoEm: entity.atualizadoEm,
      usuarioId: entity.usuario?.id,
      cursoId: entity.curso?.id,
    };
  }

  async findByCourse(courseId: number) {
  return this.repo.find({
    where: { curso: { id: courseId } },
    relations: ['usuario'],
  });
}
}
