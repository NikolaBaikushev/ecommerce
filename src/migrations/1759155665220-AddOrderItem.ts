import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderItem1759155665220 implements MigrationInterface {
    name = 'AddOrderItem1759155665220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "orderId" integer, "productId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "total" decimal NOT NULL, "status" varchar CHECK( "status" IN ('created','completed') ) NOT NULL DEFAULT ('created'), "customerId" integer, CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_order"("id", "total", "status", "customerId") SELECT "id", "total", "status", "customerId" FROM "order"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`ALTER TABLE "temporary_order" RENAME TO "order"`);
        await queryRunner.query(`CREATE TABLE "temporary_order_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "orderId" integer, "productId" integer, CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_order_item"("id", "quantity", "orderId", "productId") SELECT "id", "quantity", "orderId", "productId" FROM "order_item"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`ALTER TABLE "temporary_order_item" RENAME TO "order_item"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" RENAME TO "temporary_order_item"`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "orderId" integer, "productId" integer)`);
        await queryRunner.query(`INSERT INTO "order_item"("id", "quantity", "orderId", "productId") SELECT "id", "quantity", "orderId", "productId" FROM "temporary_order_item"`);
        await queryRunner.query(`DROP TABLE "temporary_order_item"`);
        await queryRunner.query(`ALTER TABLE "order" RENAME TO "temporary_order"`);
        await queryRunner.query(`CREATE TABLE "order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "total" decimal NOT NULL, "status" varchar CHECK( "status" IN ('') ) NOT NULL, "customerId" integer, CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "order"("id", "total", "status", "customerId") SELECT "id", "total", "status", "customerId" FROM "temporary_order"`);
        await queryRunner.query(`DROP TABLE "temporary_order"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
    }

}
