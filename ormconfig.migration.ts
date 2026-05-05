import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,

  ssl: isProd
    ? {
        rejectUnauthorized: false,
      }
    : false,

  entities: isProd
    ? ['dist/src/infrastructure/database/entities/*.entity.js']
    : ['src/infrastructure/database/entities/*.entity.ts'],

  migrations: isProd
    ? ['dist/src/infrastructure/database/migrations/*.js']
    : ['src/infrastructure/database/migrations/*.ts'],
});