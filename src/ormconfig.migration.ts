// src/ormconfig.migration.ts

import { DataSource } from 'typeorm';
import { Usuario } from './domain/usuario/usuario.entity';
import { Curso } from './domain/curso/curso.entity';
import { Modulo } from './domain/modulo/modulo.entity';
import { Aula } from './domain/aula/aula.entity';
import { Inscricao } from './domain/inscricao/inscricao.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Usuario, Curso, Modulo, Aula, Inscricao],
  migrations: [
    isProd
      ? 'dist/infrastructure/database/migrations/*.js'
      : 'src/infrastructure/database/migrations/*.ts'
  ],
});
