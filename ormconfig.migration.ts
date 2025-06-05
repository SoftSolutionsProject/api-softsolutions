import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { UsuarioEntity } from './src/infrastructure/database/entities/usuario.entity';
import { CursoEntity } from './src/infrastructure/database/entities/curso.entity';
import { ModuloEntity } from './src/infrastructure/database/entities/modulo.entity';
import { AulaEntity } from './src/infrastructure/database/entities/aula.entity';
import { InscricaoEntity } from './src/infrastructure/database/entities/inscricao.entity';
import { ProgressoAulaEntity } from './src/infrastructure/database/entities/progresso-aula.entity';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [UsuarioEntity, CursoEntity, ModuloEntity, AulaEntity, ProgressoAulaEntity, InscricaoEntity],
  migrations: [
    isProd
      ? 'dist/infrastructure/database/migrations/*.js'
      : 'src/infrastructure/database/migrations/*.ts',
  ],
});