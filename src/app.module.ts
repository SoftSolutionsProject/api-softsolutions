import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ApplicationModule } from './application/application.module';
import { InterfacesModule } from './interfaces/interfaces.module';
import { ArtifactsModule } from './artifacts/artifacts.module';
import { SearchModule } from './modules/search.module';
import { ChatbotModule } from './modules/chatbot.module';
import { getDatabaseUrl } from './infrastructure/database/database-url';

const isProd = process.env.NODE_ENV === 'production';
const databaseUrl = getDatabaseUrl();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: databaseUrl,

      ssl: isProd
        ? { rejectUnauthorized: false }
        : false,

      autoLoadEntities: true,
      synchronize: false,

      migrations: [
        'dist/infrastructure/database/migrations/*.js',
        'dist/src/infrastructure/database/migrations/*.js',
      ],
      migrationsRun: true,
    }),

    InfrastructureModule,
    ApplicationModule,
    InterfacesModule,
    ArtifactsModule,
    SearchModule,
    ChatbotModule,
  ],
})
export class AppModule {}
