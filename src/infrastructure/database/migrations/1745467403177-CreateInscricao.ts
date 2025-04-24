import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInscricao1745467403177 implements MigrationInterface {
    name = 'CreateInscricao1745467403177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inscricoes" ("id" SERIAL NOT NULL, "idUser" integer NOT NULL, "idModulo" integer NOT NULL, "statusInscricao" integer NOT NULL DEFAULT '0', "dataInscricao" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ebd737a6142cd2d66d8aed0bcdd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "inscricoes"`);
    }

}
