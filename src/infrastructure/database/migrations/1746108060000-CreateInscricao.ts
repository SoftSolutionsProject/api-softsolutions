import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInscricao1746108060000 implements MigrationInterface {
  name = 'CreateInscricao1746108060000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "inscricoes" (
        "id" SERIAL NOT NULL,
        "idUser" INTEGER NOT NULL,
        "idModulo" INTEGER NOT NULL,
        "statusInscricao" INTEGER NOT NULL DEFAULT 0,
        "dataInscricao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_inscricao_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "inscricoes"`);
  }
}