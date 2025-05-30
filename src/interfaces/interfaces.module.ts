import { Module } from '@nestjs/common';
import { UsuarioController } from './http/controllers/usuario.controller';
import { CursoController } from './http/controllers/curso.controller';
import { ApplicationModule } from '../application/application.module';
import { ModuloController } from './http/controllers/modulo.controller';
import { AulaController } from './http/controllers/aula.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [UsuarioController, CursoController, ModuloController, AulaController],
})
export class InterfacesModule {}