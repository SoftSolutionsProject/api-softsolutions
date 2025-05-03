import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAula1746108000000 implements MigrationInterface {
  name = 'CreateAula1746108000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "aulas" (
        "id" SERIAL NOT NULL,
        "nomeAula" VARCHAR NOT NULL,
        "tempoAula" INTEGER NOT NULL,
        "videoUrl" VARCHAR NOT NULL,
        "materialApoio" TEXT,
        "descricaoConteudo" VARCHAR NOT NULL,
        "moduloId" INTEGER,
        CONSTRAINT "PK_aula_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_aula_modulo" FOREIGN KEY ("moduloId") REFERENCES "modulos"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "aulas"`);
  }
}