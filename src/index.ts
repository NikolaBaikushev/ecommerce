import { Entity } from "typeorm";
import { DatabaseManager } from "./services/database.service";
import { EntityType, StoreManager } from "./services/store";

// DatabaseManager.getInstance().initialize().then(() => {
//     console.log('Successfully connected!');

//     StoreManager.create(EntityType.PRODUCT);
// }).catch(err => {
//     console.log(`Something went wrong ${err.message}`)
// })


async function main() {
    const store = StoreManager.getInstance();
    try {
        await DatabaseManager.getInstance().initialize();
        console.log('===== Database successfully connected =====')
    } catch (error) {
        console.log(`=== Database connection FAILED, ${error} ===`)
    }

    try {
        const product = await store.create(EntityType.PRODUCT);
        console.log(`===== Product created with ID: ${product.id} =====`)
    } catch (error) {
        console.log(`=== Product created FAILED ===, ${error}`)
    }
}

main();

