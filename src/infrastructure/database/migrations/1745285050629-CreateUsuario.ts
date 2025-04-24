import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsuario1745285050629 implements MigrationInterface {
    name = 'CreateUsuario1745285050629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "nomeUsuario" character varying NOT NULL, "cpfUsuario" character varying NOT NULL, "email" character varying NOT NULL, "senha" character varying NOT NULL, "telefone" character varying, "endereco" json, "localizacao" json, "tipo" character varying NOT NULL DEFAULT 'aluno', CONSTRAINT "UQ_0db4cf124f9484930230458633d" UNIQUE ("cpfUsuario"), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usuarios"`);
    }

}
