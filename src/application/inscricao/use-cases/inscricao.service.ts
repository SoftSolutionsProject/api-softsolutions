import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscricao } from '../../../domain/inscricao/inscricao.entity';
import { CreateInscricaoDto } from '../dtos/create-inscricao.dto';

@Injectable()
export class InscricaoService {
  constructor(
    @InjectRepository(Inscricao)
    private readonly inscricaoRepo: Repository<Inscricao>,
  ) {}

  async inscrever(dto: CreateInscricaoDto): Promise<Inscricao> {
    const existente = await this.inscricaoRepo.findOneBy({ idUser: dto.idUser, idModulo: dto.idModulo });
    if (existente) throw new BadRequestException('Usuário já inscrito neste módulo');
    const inscricao = this.inscricaoRepo.create(dto);
    return this.inscricaoRepo.save(inscricao);
  }

  async listarPorUsuario(idUser: number): Promise<Inscricao[]> {
    const lista = await this.inscricaoRepo.findBy({ idUser });
    if (!lista.length) throw new NotFoundException('Nenhuma inscrição encontrada');
    return lista;
  }

  async cancelar(idUser: number, idModulo: number): Promise<{ message: string }> {
    const resultado = await this.inscricaoRepo.delete({ idUser, idModulo });
    if (!resultado.affected) throw new NotFoundException('Inscrição não encontrada');
    return { message: 'Inscrição cancelada com sucesso' };
  }
}