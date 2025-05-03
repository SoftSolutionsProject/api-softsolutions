import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';

import { UsuarioModule } from './interfaces/http/usuario/usuario.module';
import { CursoModule } from './interfaces/http/curso/curso.module';
import { ModuloModule } from './interfaces/http/modulo/modulo.module';
import { AulaModule } from './interfaces/http/aula/aula.module';
import { InscricaoModule } from './interfaces/http/inscricao/inscricao.module';
import { EmailModule } from './interfaces/http/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
      migrations: ['dist/infrastructure/database/migrations/*.js'],
      migrationsRun: true,
    }),
    UsuarioModule,
    CursoModule,
    ModuloModule,
    AulaModule,
    InscricaoModule,
    EmailModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
