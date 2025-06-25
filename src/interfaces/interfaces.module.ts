import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { InfrastructureModule } from '../../src/infrastructure/infrastructure.module';

import { UsuarioController } from './http/controllers/usuario.controller';
import { CursoController } from './http/controllers/curso.controller';
import { ModuloController } from './http/controllers/modulo.controller';
import { AulaController } from './http/controllers/aula.controller';
import { InscricaoController } from './http/controllers/inscricao.controller';
import { EmailController } from './http/controllers/email.controller';
import { CertificadoController } from './http/controllers/certificado.controller';
import { AvaliacaoController } from './http/controllers/avaliacao.controller';
import { DashboardController } from './http/controllers/dashboard.controller';


@Module({
  imports: [InfrastructureModule, ApplicationModule],
  controllers: [
    UsuarioController,
    CursoController,
    ModuloController,
    AulaController,
    InscricaoController,
    EmailController,
    CertificadoController,
    AvaliacaoController,
    DashboardController,
  ],
})
export class InterfacesModule {}
