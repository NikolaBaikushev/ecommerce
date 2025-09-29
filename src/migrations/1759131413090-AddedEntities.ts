import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedEntities1759131413090 implements MigrationInterface {
    name = 'AddedEntities1759131413090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "price" decimal NOT NULL DEFAULT (0))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "total" decimal NOT NULL, "status" varchar CHECK( "status" IN () ) NOT NULL, "customerId" integer)`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "isPremium" boolean NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "total" decimal NOT NULL, "status" varchar CHECK( "status" IN () ) NOT NULL, "customerId" integer, CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_order"("id", "total", "status", "customerId") SELECT "id", "total", "status", "customerId" FROM "order"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`ALTER TABLE "temporary_order" RENAME TO "order"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" RENAME TO "temporary_order"`);
        await queryRunner.query(`CREATE TABLE "order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "total" decimal NOT NULL, "status" varchar CHECK( "status" IN () ) NOT NULL, "customerId" integer)`);
        await queryRunner.query(`INSERT INTO "order"("id", "total", "status", "customerId") SELECT "id", "total", "status", "customerId" FROM "temporary_order"`);
        await queryRunner.query(`DROP TABLE "temporary_order"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
