import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscricao } from '../../../domain/inscricao/inscricao.entity';
import { ProgressoAula } from '../../../domain/inscricao/progresso-aula.entity';
import { Curso } from '../../../domain/curso/curso.entity';
import { Aula } from '../../../domain/aula/aula.entity';
import { Usuario } from '../../../domain/usuario/usuario.entity';

@Injectable()
export class InscricaoService {
  constructor(
    @InjectRepository(Inscricao)
    private readonly inscricaoRepo: Repository<Inscricao>,
    @InjectRepository(ProgressoAula)
    private readonly progressoRepo: Repository<ProgressoAula>,
    @InjectRepository(Curso)
    private readonly cursoRepo: Repository<Curso>,
    @InjectRepository(Aula)
    private readonly aulaRepo: Repository<Aula>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  

  async inscrever(idUsuario: number, idCurso: number): Promise<Inscricao> {
    const [usuario, curso] = await Promise.all([
      this.usuarioRepo.findOneBy({ id: idUsuario }),
      this.cursoRepo.findOne({ 
        where: { id: idCurso },
        relations: ['modulos', 'modulos.aulas']
      })
    ]);

    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    if (!curso) throw new NotFoundException('Curso não encontrado');

    const inscricaoExistente = await this.inscricaoRepo.findOne({ 
      where: { usuario: { id: idUsuario }, curso: { id: idCurso } }
    });

    if (inscricaoExistente) {
      throw new BadRequestException('Usuário já inscrito neste curso');
    }

    const inscricao = this.inscricaoRepo.create({
      usuario,
      curso,
      status: 'ativo'
    });

    const savedInscricao = await this.inscricaoRepo.save(inscricao);

    // Inicializa o progresso para todas as aulas do curso
    const aulas = curso.modulos.flatMap(modulo => modulo.aulas);
    const progressos = aulas.map(aula => 
      this.progressoRepo.create({
        inscricao: savedInscricao,
        aula,
        concluida: false
      })
    );

    await this.progressoRepo.save(progressos);

    return savedInscricao;
  }

  

  async marcarAulaConcluida(idInscricao: number, idAula: number, idUsuario: number): Promise<ProgressoAula> {
    // Primeiro verifica se a inscrição pertence ao usuário
    await this.verificarInscricaoDoUsuario(idInscricao, idUsuario);

    const progresso = await this.progressoRepo.findOne({
        where: { 
            inscricao: { id: idInscricao },
            aula: { id: idAula }
        },
        relations: ['inscricao', 'aula', 'inscricao.curso']
    });

    if (!progresso) {
        throw new NotFoundException('Progresso não encontrado para esta aula e inscrição');
    }

    // Verifica se a aula pertence ao curso da inscrição
    const aula = await this.aulaRepo.findOne({
        where: { id: idAula },
        relations: ['modulo', 'modulo.curso']
    });

    if (!aula || aula.modulo.curso.id !== progresso.inscricao.curso.id) {
        throw new BadRequestException('Aula não pertence ao curso da inscrição');
    }

    progresso.concluida = true;
    progresso.dataConclusao = new Date();

    return this.progressoRepo.save(progresso);
}

async getProgressoCurso(idInscricao: number) {
  const inscricao = await this.inscricaoRepo.findOne({
    where: { id: idInscricao },
    relations: ['curso', 'curso.modulos', 'curso.modulos.aulas', 'progressoAulas']
  });

    if (!inscricao) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    const totalAulas = inscricao.curso.modulos.reduce(
      (total, modulo) => total + modulo.aulas.length, 0
    );

    const aulasConcluidas = await this.progressoRepo.count({
      where: { 
        inscricao: { id: idInscricao },
        concluida: true 
      }
    });

    const progresso = totalAulas > 0 ? (aulasConcluidas / totalAulas) * 100 : 0;

    return { progresso, aulasConcluidas, totalAulas };
  }

  async cancelarInscricao(idUsuario: number, idInscricao: number): Promise<{ message: string }> {
    const inscricao = await this.inscricaoRepo.findOne({
      where: { id: idInscricao, usuario: { id: idUsuario } }
    });

    if (!inscricao) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    inscricao.status = 'cancelado';
    await this.inscricaoRepo.save(inscricao);

    return { message: 'Inscrição cancelada com sucesso' };
  }

  async listarInscricoesUsuario(idUsuario: number): Promise<Inscricao[]> {
    return this.inscricaoRepo.find({
      where: { usuario: { id: idUsuario } },
      relations: ['curso', 'progressoAulas', 'progressoAulas.aula']
    });
  }

  private async verificarPropriedadeInscricao(idInscricao: number, idUsuario: number): Promise<Inscricao> {
    const inscricao = await this.inscricaoRepo.findOne({
      where: { id: idInscricao, usuario: { id: idUsuario } },
      relations: ['usuario']
    });
    
    if (!inscricao) {
      throw new NotFoundException('Inscrição não encontrada');
    }
    
    return inscricao;
  }

  async verificarInscricaoUsuario(idInscricao: number, idUsuario: number): Promise<boolean> {
    const inscricao = await this.inscricaoRepo.findOne({
      where: { id: idInscricao, usuario: { id: idUsuario } },
      relations: ['usuario']
    });
    return !!inscricao;
  }

async verificarInscricaoDoUsuario(idInscricao: number, idUsuario: number): Promise<void> {
  const existe = await this.inscricaoRepo.exists({
    where: {
      id: idInscricao,
      usuario: { id: idUsuario }
    }
  });
  
  if (!existe) {
    throw new NotFoundException('Inscrição não encontrada ou não pertence ao usuário');
  }
}


async getProgressoValidado(idInscricao: number, idUsuario: number) {
  // Verifica se a inscrição pertence ao usuário
  const existe = await this.inscricaoRepo.exists({
    where: { 
      id: idInscricao,
      usuario: { id: idUsuario }
    }
  });

  if (!existe) {
    throw new NotFoundException('Inscrição não encontrada');
  }

  // Retorna o progresso normalmente
  return this.getProgressoCurso(idInscricao);
}
}