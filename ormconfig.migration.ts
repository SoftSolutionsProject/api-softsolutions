import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { UsuarioEntity } from './src/infrastructure/database/entities/usuario.entity';
import { CursoEntity } from './src/infrastructure/database/entities/curso.entity';
import { ModuloEntity } from './src/infrastructure/database/entities/modulo.entity';
import { AulaEntity } from './src/infrastructure/database/entities/aula.entity';
import { InscricaoEntity } from './src/infrastructure/database/entities/inscricao.entity';
import { ProgressoAulaEntity } from './src/infrastructure/database/entities/progresso-aula.entity';
import { getDatabaseUrl } from './src/infrastructure/database/database-url';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const databaseUrl = getDatabaseUrl();

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,

  
  ssl: isProd
    ? {
        rejectUnauthorized: false,
      }
    : false,

  entities: [
    UsuarioEntity,
    CursoEntity,
    ModuloEntity,
    AulaEntity,
    ProgressoAulaEntity,
    InscricaoEntity,
  ],

  migrations: [
    isProd
      ? 'dist/{src/,}infrastructure/database/migrations/*.js'
      : 'src/infrastructure/database/migrations/*.ts',
  ],
});
