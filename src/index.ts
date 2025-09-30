import { Entity, EntityNotFoundError, UpdateStatement } from "typeorm";
import { Customer } from "./entities/Customer";
import { Product } from "./entities/Product";
import { DatabaseManager } from "./services/database.service";
import { EntityType, StoreManager } from "./services/store";
import chalk from 'chalk';
import { Logger } from "./services/logger.service";
import { UpdateProductPayload } from "./services/product.service";
import { Order } from "./entities/Order";

enum Operations {
    COMPLETE_ORDER = 'Complete Order',
    CREATE_ORDER = 'Create Order',
    CREATE_PRODUCT = 'Create Product',
    CREATE_CUSTOMER = 'Create Customer',
    ADD_TO_CART = 'Add To Cart',
    RESTOCK = 'Restock',

}



async function main() {
    let customer: Customer | null = null;
    let product: Product | null = null;

    const store = StoreManager.getInstance();
    const logger = Logger.getInstance();
    try {
        await DatabaseManager.getInstance().initialize();
        logger.bgSuccess('===== Database successfully connected =====')
    } catch (error) {
        logger.bgFail(`=== Database connection FAILED ===, ${error}`)
    }

    // try {
    //     logger.neutral(`=== OPERATION: ${Operations.CREATE_PRODUCT} STARTED ===`)
    //     product = await createProduct(store);
    //     logger.neutral(`=== OPERATION: ${Operations.CREATE_PRODUCT} FINISHED ===`)
    //     logger.bgSuccess(`=== RESULT: Product created with ID: ${product.id} ===`)
    // } catch (error) {
    //     logger.fail(`=== OPERATION: ${Operations.CREATE_PRODUCT} FAILED ===, ${error}`)
    // }

    // try {
    //     logger.neutral(`=== OPERATION: ${Operations.CREATE_CUSTOMER} STARTED ===`)
    //     customer = await createCustomer(store);
    //     logger.neutral(`=== OPERATION: ${Operations.CREATE_CUSTOMER} FINISHED ===`)
    //     logger.bgSuccess(`=== RESULT: Customer created with ID: ${customer.id} ===`)
    // } catch (error) {
    //     logger.fail(`=== OPERATION: ${Operations.CREATE_CUSTOMER} FAILED ===, ${error}`)
    // }

    // try {
    //     logger.neutral(`=== OPERATION: ${Operations.ADD_TO_CART} STARTED ===`)
    //     if (customer && product) {
    //         const cart = await addToCart(store, customer, product);

    //         logger.neutral(`=== OPERATION: ${Operations.ADD_TO_CART} FINISHED ===`)

    //         logger.bgSuccess(`=== RESULT: Cart created with ID: ${cart.id} ===`)
    //         logger.bgYellow(`=== RESULT ITEMS ===`)
    //         for (const item of cart) {
    //             logger.yellow(`\t +++ Cart Item ID: ${item.id} +++`)
    //         }
    //     }
    // } catch (error) {
    //     logger.fail(`=== OPERATION: ${Operations.ADD_TO_CART} FAILED ===, ${error}`)
    // }

    // // Already Existing customer!
    // try {
    //     logger.neutral(`=== OPERATION: ${Operations.ADD_TO_CART} STARTED ===`)

    //     const customer = await store.getEntityById(EntityType.CUSTOMER, { id: 3 });
    //     const product = await store.getEntityById(EntityType.PRODUCT, { id: 2 })
    //     if (customer && product) {
    //         const cart = await addToCart(store, customer, product);

    //         logger.neutral(`=== OPERATION: ${Operations.ADD_TO_CART} FINISHED ===`)
    //         logger.bgSuccess(`=== RESULT: Cart created with ID: ${cart.id} ===`)
    //         logger.bgYellow(`=== RESULT ITEMS ===`)
    //         for (const item of cart) {
    //             logger.yellow(`\t +++ Cart Item ID: ${item.id} +++`)
    //         }
    //     }
    // } catch (error) {
    //     logger.fail(`=== OPERATION: ${Operations.ADD_TO_CART} FAILED ===, ${error}`)
    // }

    // try {
    //     logger.neutral(`=== OPERATION: ${Operations.CREATE_ORDER} STARTED ===`)
    //     // const id = 3;
    //     const id = 5;

    //     const customer = await store.getEntityById(EntityType.CUSTOMER, { id: id, relations: ['cart', 'cart.items', 'cart.items.product'] });
    //     if (customer) {
    //         const order = await store.create(EntityType.ORDER, { customer });
    //         logger.neutral(`=== OPERATION: ${Operations.CREATE_ORDER} FINISHED ===`)
    //         logger.bgSuccess(`=== RESULT: Order created with ID: ${order.id} ===`)
    //         logger.bgYellow(`=== RESULT ITEMS: ===`)
    //         for (const item of order) {
    //             logger.yellow(`\t +++ Order Item ID: ${item.id} +++`)
    //         }
    //     }
    // } catch (error) {
    //     logger.fail(`=== OPERATION: ${Operations.CREATE_ORDER} FAILED ===, ${error}`);
    // }

    // // logger.green('Operation Restock!')
    // try {
    //     // restock
    //     logger.neutral(`=== OPERATION: ${Operations.RESTOCK} STARTED ===`)
    //     const product = await store.getEntityById(EntityType.PRODUCT, { id: 2 });
    //     if (product) {
    //         const updatePayload: UpdateProductPayload = {
    //             id: product.id,
    //             stock: product.stock + 15,
    //         }
    //         await store.update(EntityType.PRODUCT, updatePayload);
    //         const updatedProduct = await store.getEntityById(EntityType.PRODUCT, { id: 2 })

    //         logger.neutral(`=== OPERATION: ${Operations.RESTOCK} FINISHED ===`)
    //         logger.bgYellow(`=== RESULT BEFORE RESTOCK: ${product.stock} ===`);
            
    //         logger.bgYellow(`=== RESULT AFTER RESTOCK: ${updatedProduct!.stock} ===`);
    //     }
    // } catch (error) {
    //     logger.fail(`=== OPERATION: ${Operations.RESTOCK} FAILED ===, ${error}`)
    // }

    // try {
    //     const id = 2;

    //     logger.neutral(`=== Operation: ${Operations.COMPLETE_ORDER} STARTED ===`)

    //     const order = await store.getEntityById(EntityType.ORDER, { id: id, relations: ['items', 'items.product'] });
    //     if (!order) {
    //         throw new Error(`Order with ID: ${id} Not Found`)
    //     }
    //     await store.completeOrder(order);

    //     logger.neutral(`=== Operation: ${Operations.COMPLETE_ORDER} FINISHED ===`);
    //     logger.bgYellow(`=== RESULT STATUS BEFORE COMPLETION: ${order.status}`)
    //     const completedOrder = await store.getEntityById(EntityType.ORDER, { id: id, relations: ['items', 'items.product'] });
    //     logger.bgYellow(`=== RESULT STATUS AFTER COMPLETION: ${completedOrder!.status}`)
    // } catch (error: any) {
    //     logger.fail(`=== Operation: ${Operations.COMPLETE_ORDER} FAILED ===, ${error} `)
    // }
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
