import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAulas1748729339005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "aulas" (
        "id" SERIAL PRIMARY KEY,
        "nomeAula" VARCHAR NOT NULL,
        "tempoAula" INTEGER NOT NULL,
        "videoUrl" VARCHAR NOT NULL,
        "materialApoio" JSONB,
        "descricaoConteudo" TEXT NOT NULL,
        "moduloId" INTEGER REFERENCES modulos(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "aulas"`);
  }
}
