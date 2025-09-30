import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductStock1759221844136 implements MigrationInterface {
    name = 'AddProductStock1759221844136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "price" decimal NOT NULL DEFAULT (0), "description" varchar, "stock" integer NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "temporary_product"("id", "name", "price", "description") SELECT "id", "name", "price", "description" FROM "product"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`ALTER TABLE "temporary_product" RENAME TO "product"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" RENAME TO "temporary_product"`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "price" decimal NOT NULL DEFAULT (0), "description" varchar)`);
        await queryRunner.query(`INSERT INTO "product"("id", "name", "price", "description") SELECT "id", "name", "price", "description" FROM "temporary_product"`);
        await queryRunner.query(`DROP TABLE "temporary_product"`);
    }

}
