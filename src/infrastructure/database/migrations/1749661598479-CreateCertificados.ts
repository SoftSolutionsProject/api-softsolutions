import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCertificados1749661598479 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "certificados" (
        "id" SERIAL PRIMARY KEY,
        "numeroSerie" VARCHAR NOT NULL UNIQUE,
        "usuarioId" INTEGER REFERENCES usuarios(id),
        "cursoId" INTEGER REFERENCES cursos(id),
        "dataEmissao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "urlPdf" VARCHAR
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "certificados"`);
  }
}
