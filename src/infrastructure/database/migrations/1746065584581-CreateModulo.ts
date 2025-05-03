import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateModulo1746065584581 implements MigrationInterface {
  name = 'CreateModulo1746065584581'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "modulos" (
        "id" SERIAL NOT NULL,
        "nomeModulo" character varying NOT NULL,
        "tempoModulo" integer NOT NULL,
        "cursoId" integer,
        CONSTRAINT "PK_modulo_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_modulo_curso" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "modulos"`);
  }
}