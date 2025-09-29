import { DatabaseManager } from "./services/database.service";
import { EntityType, StoreManager } from "./services/store";



async function main() {
    const store = StoreManager.getInstance();
    try {
        await DatabaseManager.getInstance().initialize();
        console.log('===== Database successfully connected =====')
    } catch (error) {
        console.log(`=== Database connection FAILED, ${error} ===`)
    }

    try {
        const product = await store.create(EntityType.PRODUCT, {
            name: `Product ${Math.floor(Math.random() * 1000)}`,
            price: Math.round((1 + Math.random() * 99) * 100) / 100
        });
        console.log(`===== Product created with ID: ${product.id} =====`)
    } catch (error) {
        console.log(`=== Product created FAILED ===, ${error}`)
    }

    try {
        const customer = await store.create(EntityType.CUSTOMER, {
            name: `Customer ${Math.floor(Math.random() * 1000)}`,
            isPremium: Math.random() < 0.5,
        });
        console.log(`===== Customer created with ID: ${customer.id} =====`)
    } catch (error) {
        console.log(`=== Customer created FAILED ===, ${error}`)
    }
}

main();

