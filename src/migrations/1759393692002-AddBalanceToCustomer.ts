import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBalanceToCustomer1759393692002 implements MigrationInterface {
    name = 'AddBalanceToCustomer1759393692002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_customer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "isPremium" boolean NOT NULL DEFAULT (0), "balance" decimal NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "temporary_customer"("id", "name", "isPremium") SELECT "id", "name", "isPremium" FROM "customer"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`ALTER TABLE "temporary_customer" RENAME TO "customer"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" RENAME TO "temporary_customer"`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "isPremium" boolean NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "customer"("id", "name", "isPremium") SELECT "id", "name", "isPremium" FROM "temporary_customer"`);
        await queryRunner.query(`DROP TABLE "temporary_customer"`);
    }

}
