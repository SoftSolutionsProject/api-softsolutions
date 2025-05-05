// src/infrastructure/database/migrations/1746108060000-CreateInscricao.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInscricao1746108060000 implements MigrationInterface {
  name = 'CreateInscricao1746108060000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "inscricoes" (
        "id" SERIAL NOT NULL,
        "dataInscricao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "status" character varying NOT NULL DEFAULT 'ativo',
        "usuarioId" integer,
        "cursoId" integer,
        CONSTRAINT "PK_inscricao_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_inscricao_usuario" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_inscricao_curso" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "inscricoes"`);
  }
}