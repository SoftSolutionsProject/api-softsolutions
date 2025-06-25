import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { UsuarioEntity } from '../../src/infrastructure/database/entities/usuario.entity';
import { CursoEntity } from '../../src/infrastructure/database/entities/curso.entity';
import { ModuloEntity } from '../infrastructure/database/entities/modulo.entity';
import { AulaEntity } from '../../src/infrastructure/database/entities/aula.entity';
import { InscricaoEntity } from '../infrastructure/database/entities/inscricao.entity';
import { ProgressoAulaEntity } from '../infrastructure/database/entities/progresso-aula.entity';
import { CertificadoEntity } from '../infrastructure/database/entities/certificado.entity';
import { AvaliacaoEntity } from '../infrastructure/database/entities/avaliacao.entity';

import { InfrastructureModule } from '../../src/infrastructure/infrastructure.module';

// Usuario use cases
import { CreateUsuarioUseCase } from './use-cases/usuario/create-usuario.use-case';
import { DeleteUsuarioUseCase } from './use-cases/usuario/delete-usuario.use-case';
import { GetUsuarioByIdUseCase } from './use-cases/usuario/get-usuario-by-id.use-case';
import { ListUsuarioUseCase } from './use-cases/usuario/list-usuario.use-case';
import { LoginUsuarioUseCase } from './use-cases/usuario/login-usuario.use-case';
import { UpdateUsuarioUseCase } from './use-cases/usuario/update-usuario.use-case';

// Email
import { EnviarEmailUseCase } from './use-cases/email/enviar-email.use-case';

// Curso use cases
import { CreateCursoUseCase } from './use-cases/curso/create-curso.use-case';
import { DeleteCursoUseCase } from './use-cases/curso/delete-curso.use-case';
import { GetCursoByIdUseCase } from './use-cases/curso/get-curso-by-id.use-case';
import { ListCursoUseCase } from './use-cases/curso/list-curso.use-case';
import { UpdateCursoUseCase } from './use-cases/curso/update-curso.use-case';

// Modulo use cases
import { CreateModuloUseCase } from './use-cases/modulo/create-modulo.use-case';
import { DeleteModuloUseCase } from './use-cases/modulo/delete-modulo.use-case';
import { GetModuloByIdUseCase } from './use-cases/modulo/get-modulo-by-id.use-case';
import { ListModuloUseCase } from './use-cases/modulo/list-modulo.use-case';
import { UpdateModuloUseCase } from './use-cases/modulo/update-modulo.use-case';

// Aula use cases
import { CreateAulaUseCase } from './use-cases/aula/create-aula.use-case';
import { DeleteAulaUseCase } from './use-cases/aula/delete-aula.use-case';
import { GetAulaByIdUseCase } from './use-cases/aula/get-aula-by-id.use-case';
import { ListAulaUseCase } from './use-cases/aula/list-aula.use-case';
import { UpdateAulaUseCase } from './use-cases/aula/update-aula.use-case';
import { ListAulaByModuloUseCase } from './use-cases/aula/list-aula-by-modulo.use-case';
import { ListAulaByCursoUseCase } from './use-cases/aula/list-aula-by-curso.use-case';

// Inscricao use cases
import { InscreverUsuarioUseCase } from './use-cases/inscricao/inscrever-usuario.use-case';
import { ListarInscricoesUseCase } from './use-cases/inscricao/listar-inscricoes.use-case';
import { MarcarAulaConcluidaUseCase } from './use-cases/inscricao/marcar-aula-concluida.use-case';
import { CancelarInscricaoUseCase } from './use-cases/inscricao/cancelar-inscricao.use-case';
import { VerProgressoUseCase } from './use-cases/inscricao/ver-progresso.use-case';
import { DesmarcarAulaConcluidaUseCase } from './use-cases/inscricao/desmarcar-aula-concluida.use-case';

// Certificado
import { EmitirCertificadoUseCase } from './use-cases/certificado/emitir-certificado.use-case';

// Avaliacao use cases
import { CriarAvaliacaoUseCase } from './use-cases/avaliacao/criar-avaliacao.use-case';
import { AtualizarAvaliacaoUseCase } from './use-cases/avaliacao/atualizar-avaliacao.use-case';

// Dashboard use case
import { BuildDashboardUseCase } from './use-cases/dashboard/build-dashboard.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsuarioEntity, CursoEntity, ModuloEntity, AulaEntity,
      InscricaoEntity, ProgressoAulaEntity, CertificadoEntity, AvaliacaoEntity
    ]),
    InfrastructureModule,
  ],
  providers: [
    // Usuario
    CreateUsuarioUseCase, DeleteUsuarioUseCase, GetUsuarioByIdUseCase,
    ListUsuarioUseCase, LoginUsuarioUseCase, UpdateUsuarioUseCase,

    // Curso
    CreateCursoUseCase, DeleteCursoUseCase, GetCursoByIdUseCase,
    ListCursoUseCase, UpdateCursoUseCase,

    // Modulo
    CreateModuloUseCase, DeleteModuloUseCase, GetModuloByIdUseCase,
    ListModuloUseCase, UpdateModuloUseCase,

    // Aula
    CreateAulaUseCase, DeleteAulaUseCase, GetAulaByIdUseCase,
    ListAulaUseCase, UpdateAulaUseCase, ListAulaByModuloUseCase, ListAulaByCursoUseCase,

    // Inscricao
    InscreverUsuarioUseCase, ListarInscricoesUseCase, MarcarAulaConcluidaUseCase,
    CancelarInscricaoUseCase, VerProgressoUseCase, DesmarcarAulaConcluidaUseCase,

    // Email
    EnviarEmailUseCase,

    // Certificado
    EmitirCertificadoUseCase,

    // Avaliacao
    CriarAvaliacaoUseCase, AtualizarAvaliacaoUseCase,

    // Dashboard
    BuildDashboardUseCase
  ],
  exports: [
    // Usuario
    CreateUsuarioUseCase, DeleteUsuarioUseCase, GetUsuarioByIdUseCase,
    ListUsuarioUseCase, LoginUsuarioUseCase, UpdateUsuarioUseCase,

    // Curso
    CreateCursoUseCase, DeleteCursoUseCase, GetCursoByIdUseCase,
    ListCursoUseCase, UpdateCursoUseCase,

    // Modulo
    CreateModuloUseCase, DeleteModuloUseCase, GetModuloByIdUseCase,
    ListModuloUseCase, UpdateModuloUseCase,

    // Aula
    CreateAulaUseCase, DeleteAulaUseCase, GetAulaByIdUseCase,
    ListAulaUseCase, UpdateAulaUseCase, ListAulaByModuloUseCase, ListAulaByCursoUseCase,

    // Inscricao
    InscreverUsuarioUseCase, ListarInscricoesUseCase, MarcarAulaConcluidaUseCase,
    CancelarInscricaoUseCase, VerProgressoUseCase, DesmarcarAulaConcluidaUseCase,

    // Email
    EnviarEmailUseCase,

    // Certificado
    EmitirCertificadoUseCase,

    // Avaliacao
    CriarAvaliacaoUseCase, AtualizarAvaliacaoUseCase,

    // Dashboard
    BuildDashboardUseCase
  ],
})
export class ApplicationModule {}
