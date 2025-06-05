import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsuarios1748729336296 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "usuarios" (
        "id" SERIAL PRIMARY KEY,
        "nomeUsuario" VARCHAR NOT NULL,
        "cpfUsuario" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL,
        "senha" VARCHAR NOT NULL,
        "telefone" VARCHAR,
        "endereco" JSONB,
        "localizacao" JSONB,
        "tipo" VARCHAR NOT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "usuarios"`);
  }
}
