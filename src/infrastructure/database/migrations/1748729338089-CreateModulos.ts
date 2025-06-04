import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateModulos1748729338089 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "modulos" (
        "id" SERIAL PRIMARY KEY,
        "nomeModulo" VARCHAR NOT NULL,
        "tempoModulo" INTEGER NOT NULL,
        "cursoId" INTEGER REFERENCES cursos(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "modulos"`);
  }
}
