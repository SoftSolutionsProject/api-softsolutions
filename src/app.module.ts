import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ApplicationModule } from './application/application.module';
import { InterfacesModule } from './interfaces/interfaces.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
      migrations: ['dist/infrastructure/database/migrations/*.js'],
      migrationsRun: true,
    }),
    InfrastructureModule,
    ApplicationModule,
    InterfacesModule,
  ],
})
export class AppModule {}
