// src/infrastructure/database/migrations/1749999999999-CreateProgressoAula.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProgressoAula1749999999999 implements MigrationInterface {
  name = 'CreateProgressoAula1749999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "progresso_aula" (
        "id" SERIAL NOT NULL,
        "concluida" boolean NOT NULL DEFAULT false,
        "dataConclusao" TIMESTAMP,
        "inscricaoId" integer,
        "aulaId" integer,
        CONSTRAINT "PK_progresso_aula_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_progresso_inscricao" FOREIGN KEY ("inscricaoId") REFERENCES "inscricoes"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_progresso_aula" FOREIGN KEY ("aulaId") REFERENCES "aulas"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "progresso_aula"`);
  }
}