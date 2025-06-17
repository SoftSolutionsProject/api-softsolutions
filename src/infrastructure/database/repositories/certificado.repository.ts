// src/infrastructure/database/repositories/certificado.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CertificadoEntity } from '../entities/certificado.entity';
import { UsuarioEntity } from '../entities/usuario.entity';
import { CursoEntity } from '../entities/curso.entity';
import { CertificadoModel } from 'src/domain/models/certificado.model';
import { InscricaoModel } from 'src/domain/models/inscricao.model';
import { UsuarioRepository } from './usuario.repository';
import { CursoRepository } from './curso.repository';

@Injectable()
export class CertificadoRepository {
  constructor(
    @InjectRepository(CertificadoEntity)
    private readonly repo: Repository<CertificadoEntity>,
    private readonly usuarioRepo: UsuarioRepository,
    private readonly cursoRepo: CursoRepository,
  ) {}

  async create(data: Partial<CertificadoModel>): Promise<CertificadoEntity> {
  if (!data.usuario || !data.usuario.id) {
    throw new Error('Usuário não informado ou sem ID');
  }

  if (!data.curso || !data.curso.id) {
    throw new Error('Curso não informado ou sem ID');
  }

  const usuarioEntity = await this.usuarioRepo.findById(data.usuario.id);
  const cursoEntity = await this.cursoRepo.findById(data.curso.id);

  const certificado = this.repo.create({
    numeroSerie: data.numeroSerie!,
    usuario: usuarioEntity as any,
    curso: cursoEntity as any,
    dataEmissao: data.dataEmissao!,
  });

  return this.repo.save(certificado);
}


  async findByNumeroSerie(numeroSerie: string): Promise<CertificadoEntity | null> {
    return this.repo.findOne({
      where: { numeroSerie },
      relations: ['usuario', 'curso'],
    });
  }

  async findByInscricao(inscricao: InscricaoModel): Promise<CertificadoEntity | null> {
    return this.repo.findOne({
      where: {
        usuario: { id: inscricao.usuario.id },
        curso: { id: inscricao.curso.id },
      },
      relations: ['usuario', 'curso'],
    });
  }
}
