import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/infrastructure/database/entities/usuario.entity';
import { CursoEntity } from 'src/infrastructure/database/entities/curso.entity';

import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';

// Usuario use cases
import { CreateUsuarioUseCase } from './use-cases/usuario/create-usuario.use-case';
import { DeleteUsuarioUseCase } from './use-cases/usuario/delete-usuario.use-case';
import { GetUsuarioByIdUseCase } from './use-cases/usuario/get-usuario-by-id.use-case';
import { ListUsuarioUseCase } from './use-cases/usuario/list-usuario.use-case';
import { LoginUsuarioUseCase } from './use-cases/usuario/login-usuario.use-case';
import { UpdateUsuarioUseCase } from './use-cases/usuario/update-usuario.use-case';

// Curso use cases
import { CreateCursoUseCase } from './use-cases/curso/create-curso.use-case';
import { DeleteCursoUseCase } from './use-cases/curso/delete-curso.use-case';
import { GetCursoByIdUseCase } from './use-cases/curso/get-curso-by-id.use-case';
import { ListCursoUseCase } from './use-cases/curso/list-curso.use-case';
import { UpdateCursoUseCase } from './use-cases/curso/update-curso.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioEntity, CursoEntity]),
    InfrastructureModule,
  ],
  providers: [
    // Usuario
    CreateUsuarioUseCase,
    DeleteUsuarioUseCase,
    GetUsuarioByIdUseCase,
    ListUsuarioUseCase,
    LoginUsuarioUseCase,
    UpdateUsuarioUseCase,
    // Curso
    CreateCursoUseCase,
    DeleteCursoUseCase,
    GetCursoByIdUseCase,
    ListCursoUseCase,
    UpdateCursoUseCase,
  ],
  exports: [
    // Usuario
    CreateUsuarioUseCase,
    DeleteUsuarioUseCase,
    GetUsuarioByIdUseCase,
    ListUsuarioUseCase,
    LoginUsuarioUseCase,
    UpdateUsuarioUseCase,
    // Curso
    CreateCursoUseCase,
    DeleteCursoUseCase,
    GetCursoByIdUseCase,
    ListCursoUseCase,
    UpdateCursoUseCase,
  ],
})
export class ApplicationModule {}