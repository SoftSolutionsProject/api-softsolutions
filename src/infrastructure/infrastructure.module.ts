import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './database/entities/usuario.entity';
import { UsuarioRepository } from './database/repositories/usuario.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  providers: [UsuarioRepository],
  exports: [UsuarioRepository],
})
export class InfrastructureModule {}
