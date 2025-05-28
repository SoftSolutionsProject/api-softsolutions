import { Module } from '@nestjs/common';
import { UsuarioController } from './http/controllers/usuario.controller';
import { ApplicationModule } from '../application/application.module'; // 👈 Importa a camada application

@Module({
  imports: [ApplicationModule],
  controllers: [UsuarioController],
})
export class InterfacesModule {}
