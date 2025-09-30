import { Entity, UpdateStatement } from "typeorm";
import { Customer } from "./entities/Customer";
import { Product } from "./entities/Product";
import { DatabaseManager } from "./services/database.service";
import { EntityType, StoreManager } from "./services/store";
import chalk from 'chalk';
import { Logger } from "./services/logger.service";
import { UpdateProductPayload } from "./services/product.service";


async function main() {
    let customer: Customer | null = null;
    let product: Product | null = null;

    const store = StoreManager.getInstance();
    const logger = Logger.getInstance();
    try {
        await DatabaseManager.getInstance().initialize();
        logger.green('===== Database successfully connected =====')
    } catch (error) {
        logger.red(`=== Database connection FAILED, ${error} ===`)
    }

    // try {
    //     product = await createProduct(store);
    //     logger.green(`===== Product created with ID: ${product.id} =====`)
    // } catch (error) {
    //     logger.red(`=== Product created FAILED ===, ${error}`)
    // }

    // try {
    //     customer = await createCustomer(store);
    //     logger.green(`===== Customer created with ID: ${customer.id} =====`)
    // } catch (error) {
    //     logger.red(`=== Customer created FAILED ===, ${error}`)
    // }


    // try {
    //     if (customer && product) {
    //         const cart = await addToCart(store, customer, product);
    //         logger.green(`===== Cart created with ID: ${cart.id} =====`)
    //         logger.bgYellow(`===== Cart Items created: ${cart.id} =====`)
    //         for (const item of cart) {
    //             logger.yellow(`\t ++++ ${item.id} ++++`)
    //         }
    //     }
    // } catch (error) {
    //     console.log(`=== Cart created FAILED ===, ${error}`)
    // }

    // // Already Existing customer!
    // try {
    //     const customer = await store.getEntityById(EntityType.CUSTOMER, { id: 3 });
    //     const product = await store.getEntityById(EntityType.PRODUCT, { id: 2 })
    //     if (customer && product) {
    //         const cart = await addToCart(store, customer, product);
    //         logger.green(`===== Cart Items Count: ${cart.items.length} =====`)
    //         logger.bgYellow(`===== Cart Items Created: ${cart.id} =====`)
    //         for (const item of cart) {
    //             logger.yellow(`\t ++++ ${item.id} ++++`)
    //         }
    //     }
    // } catch (error) {
    //     logger.red(`=== Cart created FAILED ===, ${error}`)
    // }

    // try {
    //     const customer = await store.getEntityById(EntityType.CUSTOMER, { id: 3, relations: ['cart', 'cart.items', 'cart.items.product'] });
    //     if (customer) {
    //         const order = await store.create(EntityType.ORDER, { customer });
    //         logger.green(`===== Order created with ID: ${order.id} =====`)
    //         logger.bgYellow(`===== Order Items created: ${order.id} =====`)
    //         for (const item of order) {
    //             logger.yellow(`\t ++++ Order Item ID: ${item.id} ++++`)
    //         }
    //     }
    // } catch (error) {
    //     logger.red(`=== Order created FAILED ===, ${error}`);
    // }

    // logger.green('Operation Restock!')
    // try {
    //     // restock
    //     const product = await store.getEntityById(EntityType.PRODUCT, { id:2});
    //     if (product) {
    //         logger.bgYellow(`==== Previous Stock: ${product.stock}`);
    //         const updatePayload: UpdateProductPayload = {
    //             id: product.id,
    //             stock: product.stock + 15,
    //         }
    //         await store.update(EntityType.PRODUCT, updatePayload);
    //         const updatedProduct = await store.getEntityById(EntityType.PRODUCT, {id: 2})
    //         logger.bgYellow(`==== After Restock: ${updatedProduct!.stock}`);
    //     }
    // }catch(error){

    // }

    // TODO: completeOrder => add discounts, validate stock (from product.stock) and such ...
    // TODO: Change status to completed,
}

main();



async function createProduct(store: StoreManager) {
    try {
        // TODO: add stock;
        const product = await store.create(EntityType.PRODUCT, {
            name: `Product ${Math.floor(Math.random() * 1000)}`,
            price: Math.round((1 + Math.random() * 99) * 100) / 100,
            
        });
        return product
    } catch (error) {
        throw error
    }
}

async function createCustomer(store: StoreManager) {
    try {
        const customer = await store.create(EntityType.CUSTOMER, {
            name: `Customer ${Math.floor(Math.random() * 1000)}`,
            isPremium: Math.random() < 0.5,
        });
        return customer
    } catch (error) {
        throw error;
    }
}

async function addToCart(store: StoreManager, customer: Customer, product: Product) {
    try {
        const cart = await store.addToCart({ customer, product });
        return cart
    } catch (error) {
        throw error
    }
}
