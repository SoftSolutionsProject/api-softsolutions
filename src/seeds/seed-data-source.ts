import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { UsuarioEntity } from '../infrastructure/database/entities/usuario.entity';
import { CursoEntity } from '../infrastructure/database/entities/curso.entity';
import { ModuloEntity } from '../infrastructure/database/entities/modulo.entity';
import { AulaEntity } from '../infrastructure/database/entities/aula.entity';
import { InscricaoEntity } from '../infrastructure/database/entities/inscricao.entity';
import { ProgressoAulaEntity } from '../infrastructure/database/entities/progresso-aula.entity';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export const seedDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
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
    InscricaoEntity,
    ProgressoAulaEntity,
  ],
});