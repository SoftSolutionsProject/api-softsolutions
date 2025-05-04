import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import { Usuario } from '../../../domain/usuario/usuario.entity';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [
    AuthGuard,
    Reflector,
  ],
  exports: [
    AuthGuard,
    TypeOrmModule.forFeature([Usuario]), // Adicione esta linha
  ],
})
export class AuthModule {}