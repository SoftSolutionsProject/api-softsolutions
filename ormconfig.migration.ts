import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { UsuarioEntity } from './src/infrastructure/database/entities/usuario.entity';



dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [UsuarioEntity],
  migrations: [
    isProd
      ? 'dist/infrastructure/database/migrations/*.js'
      : 'src/infrastructure/database/migrations/*.ts',
  ],
});
