import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProgressoAula1748739816597 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "progresso_aula" (
        "id" SERIAL PRIMARY KEY,
        "inscricaoId" INTEGER REFERENCES inscricoes(id),
        "aulaId" INTEGER REFERENCES aulas(id),
        "concluida" BOOLEAN DEFAULT false,
        "dataConclusao" TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "progresso_aula"`);
  }
}
