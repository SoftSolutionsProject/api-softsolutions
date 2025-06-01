import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsuarioRepository } from '../../../infrastructure/database/repositories/usuario.repository';
import { CursoRepository } from '../../../infrastructure/database/repositories/curso.repository';
import { InscricaoRepository } from '../../../infrastructure/database/repositories/inscricao.repository';
import { ProgressoAulaRepository } from '../../../infrastructure/database/repositories/progresso-aula.repository';
import { AulaRepository } from '../../../infrastructure/database/repositories/aula.repository';

@Injectable()
export class InscreverUsuarioUseCase {
  constructor(
    private readonly usuarioRepo: UsuarioRepository,
    private readonly cursoRepo: CursoRepository,
    private readonly inscricaoRepo: InscricaoRepository,
    private readonly progressoRepo: ProgressoAulaRepository,
    private readonly aulaRepo: AulaRepository,
  ) {}


// Atualize o método execute no inscrever-usuario.use-case.ts
async execute(idUsuario: number, idCurso: number) {
    const [usuario, curso] = await Promise.all([
  this.usuarioRepo.findById(idUsuario),
  this.cursoRepo.findByIdWithModulosAndAulas(idCurso),
]);

    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    if (!curso) throw new NotFoundException('Curso não encontrado');

    const inscricaoExistente = await this.inscricaoRepo.findByUsuarioAndCurso(idUsuario, idCurso);

    if (inscricaoExistente) {
      if (inscricaoExistente.status === 'cancelado') {
        inscricaoExistente.status = 'ativo';
        inscricaoExistente.dataInscricao = new Date();
        return this.inscricaoRepo.update(inscricaoExistente.id!, inscricaoExistente);
      } else {
        throw new BadRequestException('Usuário já inscrito neste curso');
      }
    }

    const inscricao = await this.inscricaoRepo.create({
      usuario,
      curso,
      status: 'ativo'
    });

    const aulas = curso.modulos?.flatMap(modulo => modulo.aulas || []) || [];
    const progressos = aulas.map(aula => ({
      inscricao,
      aula,
      concluida: false
    }));

    if (progressos.length > 0) {
      await this.progressoRepo.createMany(progressos);
    }

    return inscricao;
}
}