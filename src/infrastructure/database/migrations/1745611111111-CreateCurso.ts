import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCurso1745611111111 implements MigrationInterface {
  name = 'CreateCurso1745611111111';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "cursos" (
        "id" SERIAL NOT NULL,
        "nomeCurso" VARCHAR NOT NULL,
        "tempoCurso" INTEGER NOT NULL,
        "descricaoCurta" VARCHAR NOT NULL,
        "descricaoDetalhada" VARCHAR NOT NULL,
        "professor" VARCHAR NOT NULL,
        "categoria" VARCHAR NOT NULL,
        "status" VARCHAR NOT NULL DEFAULT 'ativo',
        "avaliacao" FLOAT NOT NULL DEFAULT 0,
        "imagemCurso" VARCHAR NOT NULL,
        CONSTRAINT "PK_cursos_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cursos"`);
  }
}