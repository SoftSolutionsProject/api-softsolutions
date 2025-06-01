import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInscricoes1748739808751 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "inscricoes" (
        "id" SERIAL PRIMARY KEY,
        "usuarioId" INTEGER REFERENCES usuarios(id),
        "cursoId" INTEGER REFERENCES cursos(id),
        "dataInscricao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "status" VARCHAR NOT NULL DEFAULT 'ativo'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "inscricoes"`);
  }
}
