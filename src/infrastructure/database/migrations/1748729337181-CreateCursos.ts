import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCursos1748729337181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "cursos" (
        "id" SERIAL PRIMARY KEY,
        "nomeCurso" VARCHAR NOT NULL,
        "tempoCurso" INTEGER NOT NULL,
        "descricaoCurta" VARCHAR NOT NULL,
        "descricaoDetalhada" VARCHAR NOT NULL,
        "professor" VARCHAR NOT NULL,
        "categoria" VARCHAR NOT NULL,
        "status" VARCHAR NOT NULL DEFAULT 'ativo',
        "avaliacao" FLOAT NOT NULL DEFAULT 0,
        "imagemCurso" VARCHAR NOT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cursos"`);
  }
}
