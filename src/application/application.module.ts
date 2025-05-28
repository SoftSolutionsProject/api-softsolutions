import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../domain/models/usuario.model';

// Importa os use cases de usuario
import { CreateUsuarioUseCase } from './use-cases/usuario/create-usuario.use-case';
import { DeleteUsuarioUseCase } from './use-cases/usuario/delete-usuario.use-case';
import { GetUsuarioByIdUseCase } from './use-cases/usuario/get-usuario-by-id.use-case';
import { ListUsuarioUseCase } from './use-cases/usuario/list-usuario.use-case';
import { LoginUsuarioUseCase } from './use-cases/usuario/login-usuario.use-case';
import { UpdateUsuarioUseCase } from './use-cases/usuario/update-usuario.use-case';


@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [
    CreateUsuarioUseCase,
    DeleteUsuarioUseCase,
    GetUsuarioByIdUseCase,
    ListUsuarioUseCase,
    LoginUsuarioUseCase,
    UpdateUsuarioUseCase,
  ],
  exports: [
    CreateUsuarioUseCase,
    DeleteUsuarioUseCase,
    GetUsuarioByIdUseCase,
    ListUsuarioUseCase,
    LoginUsuarioUseCase,
    UpdateUsuarioUseCase,
  ],
})
export class ApplicationModule {}
