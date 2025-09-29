import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCart1759137625129 implements MigrationInterface {
    name = 'AddCart1759137625129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cart_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "cartId" integer, "productId" integer)`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "totalQuantity" integer NOT NULL, "totalPrice" decimal NOT NULL, "customerId" integer, CONSTRAINT "REL_eac3d1f269ffeb0999fbde0185" UNIQUE ("customerId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "price" decimal NOT NULL DEFAULT (0), "description" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_product"("id", "name", "price") SELECT "id", "name", "price" FROM "product"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`ALTER TABLE "temporary_product" RENAME TO "product"`);
        await queryRunner.query(`CREATE TABLE "temporary_cart_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "cartId" integer, "productId" integer, CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_cart_item"("id", "quantity", "cartId", "productId") SELECT "id", "quantity", "cartId", "productId" FROM "cart_item"`);
        await queryRunner.query(`DROP TABLE "cart_item"`);
        await queryRunner.query(`ALTER TABLE "temporary_cart_item" RENAME TO "cart_item"`);
        await queryRunner.query(`CREATE TABLE "temporary_cart" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "totalQuantity" integer NOT NULL, "totalPrice" decimal NOT NULL, "customerId" integer, CONSTRAINT "REL_eac3d1f269ffeb0999fbde0185" UNIQUE ("customerId"), CONSTRAINT "FK_eac3d1f269ffeb0999fbde0185b" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_cart"("id", "totalQuantity", "totalPrice", "customerId") SELECT "id", "totalQuantity", "totalPrice", "customerId" FROM "cart"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`ALTER TABLE "temporary_cart" RENAME TO "cart"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" RENAME TO "temporary_cart"`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "totalQuantity" integer NOT NULL, "totalPrice" decimal NOT NULL, "customerId" integer, CONSTRAINT "REL_eac3d1f269ffeb0999fbde0185" UNIQUE ("customerId"))`);
        await queryRunner.query(`INSERT INTO "cart"("id", "totalQuantity", "totalPrice", "customerId") SELECT "id", "totalQuantity", "totalPrice", "customerId" FROM "temporary_cart"`);
        await queryRunner.query(`DROP TABLE "temporary_cart"`);
        await queryRunner.query(`ALTER TABLE "cart_item" RENAME TO "temporary_cart_item"`);
        await queryRunner.query(`CREATE TABLE "cart_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "cartId" integer, "productId" integer)`);
        await queryRunner.query(`INSERT INTO "cart_item"("id", "quantity", "cartId", "productId") SELECT "id", "quantity", "cartId", "productId" FROM "temporary_cart_item"`);
        await queryRunner.query(`DROP TABLE "temporary_cart_item"`);
        await queryRunner.query(`ALTER TABLE "product" RENAME TO "temporary_product"`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "price" decimal NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "product"("id", "name", "price") SELECT "id", "name", "price" FROM "temporary_product"`);
        await queryRunner.query(`DROP TABLE "temporary_product"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "cart_item"`);
    }

}
