import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { UsuarioEntity } from './database/entities/usuario.entity';
import { CursoEntity } from './database/entities/curso.entity';
import { ModuloEntity } from './database/entities/modulo.entity';
import { AulaEntity } from './database/entities/aula.entity';
import { InscricaoEntity } from './database/entities/inscricao.entity';
import { ProgressoAulaEntity } from './database/entities/progresso-aula.entity';
import { CertificadoEntity } from './database/entities/certificado.entity';
import { AvaliacaoEntity } from './database/entities/avaliacao.entity';

// Repositories
import { UsuarioRepository } from './database/repositories/usuario.repository';
import { CursoRepository } from './database/repositories/curso.repository';
import { ModuloRepository } from './database/repositories/modulo.repository';
import { AulaRepository } from './database/repositories/aula.repository';
import { InscricaoRepository } from './database/repositories/inscricao.repository';
import { ProgressoAulaRepository } from './database/repositories/progresso-aula.repository';
import { CertificadoRepository } from './database/repositories/certificado.repository';
import { AvaliacaoRepository } from './database/repositories/avaliacao.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsuarioEntity, CursoEntity, ModuloEntity, AulaEntity,
      InscricaoEntity, ProgressoAulaEntity, CertificadoEntity, AvaliacaoEntity
    ]),
  ],
  providers: [
    UsuarioRepository, CursoRepository, ModuloRepository,
    AulaRepository, InscricaoRepository, ProgressoAulaRepository,
    CertificadoRepository, AvaliacaoRepository,
  ],
  exports: [
    UsuarioRepository, CursoRepository, ModuloRepository,
    AulaRepository, InscricaoRepository, ProgressoAulaRepository,
    CertificadoRepository, AvaliacaoRepository,
  ],
})
export class InfrastructureModule {}
