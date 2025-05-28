import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { Usuario } from './src/domain/models/usuario.model';
import { Curso } from './src/domain/models/curso.model';
import { Modulo } from './src/domain/models/modulo.model';
import { Aula } from './src/domain/models/aula.model';
import { Inscricao } from './src/domain/models/inscricao.model';
import { ProgressoAula } from './src/domain/models/progresso-aula.model';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Usuario, Curso, Modulo, Aula, Inscricao, ProgressoAula],
  migrations: [
    isProd
      ? 'dist/infrastructure/database/migrations/*.js'
      : 'src/infrastructure/database/migrations/*.ts',
  ],
});
