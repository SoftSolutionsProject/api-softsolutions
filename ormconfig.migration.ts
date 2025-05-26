import { DataSource } from 'typeorm';
import { Usuario } from './src/domain/usuario/usuario.entity';
import { Curso } from './src/domain/curso/curso.entity';
import { Modulo } from './src/domain/modulo/modulo.entity';
import { Aula } from './src/domain/aula/aula.entity';
import { Inscricao } from './src/domain/inscricao/inscricao.entity';
import { ProgressoAula } from './src/domain/inscricao/progresso-aula.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Usuario, Curso, Modulo, Aula, Inscricao, ProgressoAula],
  migrations: [
    isProd
      ? 'dist/infrastructure/database/migrations/*.js'
      : 'src/infrastructure/database/migrations/*.ts'
  ],
});
