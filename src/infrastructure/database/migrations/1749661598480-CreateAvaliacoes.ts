import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAvaliacoes1749661598480 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "avaliacoes" (
        "id" SERIAL PRIMARY KEY,
        "nota" INTEGER NOT NULL,
        "comentario" TEXT,
        "criadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "atualizadoEm" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "usuarioId" INTEGER REFERENCES usuarios(id),
        "cursoId" INTEGER REFERENCES cursos(id),
        UNIQUE ("usuarioId", "cursoId")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "avaliacoes"`);
  }
}
