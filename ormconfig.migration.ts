import { DataSource } from 'typeorm';
import { Usuario } from './src/domain/usuario/usuario.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [Usuario],
    migrations: ['src/infrastructure/database/migrations/*.ts'],
  });
