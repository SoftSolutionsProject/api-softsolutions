import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './interfaces/http/usuario/usuario.module';
import { InscricaoModule } from './interfaces/http/inscricao/inscricao.module';
import { AppController } from './app.controller';

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
    InscricaoModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
