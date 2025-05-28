import { Module } from '@nestjs/common';
import { UsuarioController } from './http/controllers/usuario.controller';
import { CursoController } from './http/controllers/curso.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [UsuarioController, CursoController],
})
export class InterfacesModule {}