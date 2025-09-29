import { Entity } from "typeorm";
import { Customer } from "./entities/Customer";
import { Product } from "./entities/Product";
import { DatabaseManager } from "./services/database.service";
import { EntityType, StoreManager } from "./services/store";



async function main() {
    let customer: Customer | null = null;
    let product: Product | null = null;

    const store = StoreManager.getInstance();
    try {
        await DatabaseManager.getInstance().initialize();
        console.log('===== Database successfully connected =====')
    } catch (error) {
        console.log(`=== Database connection FAILED, ${error} ===`)
    }

    // try {
    //     product = await createProduct(store);
    //     console.log(`===== Product created with ID: ${product.id} =====`)
    // } catch (error) {
    //     console.log(`=== Product created FAILED ===, ${error}`)
    // }

    // try {
    //     customer = await createCustomer(store);
    //     console.log(`===== Customer created with ID: ${customer.id} =====`)
    // } catch (error) {
    //     console.log(`=== Customer created FAILED ===, ${error}`)
    // }


    // try {
    //     if (customer && product) {
    //         const cart = await addToCart(store, customer, product);
    //         console.log(`===== Cart created with ID: ${cart.id} =====`)
    //         console.log(`===== Cart Items created: ${cart.id} =====`)
    //         cart.items.forEach((c) => console.log(`\t ==== ${c.id} ====`))
    //     }
    // } catch (error) {
    //     console.log(`=== Cart created FAILED ===, ${error}`)
    // }

    // Already Existing customer!
    // try {
    //     const customer = await store.getEntityById(EntityType.CUSTOMER, { id: 3 });
    //     const product = await store.getEntityById(EntityType.PRODUCT, { id: 2 })
    //     if (customer && product) {
    //         const cart = await addToCart(store, customer, product);
    //         console.log(`===== Cart Items Count: ${cart.items.length} =====`)
    //         console.log(`===== Cart Items created: ${cart.id} =====`)
    //         cart.items.forEach((c) => console.log(`\t ==== ${c.id} ====`))
    //     }
    // } catch (error) {
    //     console.log(`=== Cart created FAILED ===, ${error}`)
    // }

    try {
        const customer = await store.getEntityById(EntityType.CUSTOMER, { id: 3, relations: ['cart', 'cart.items', 'cart.items.product'] });
        if (customer) {
            const order = await store.create(EntityType.ORDER, { customer });
            console.log(`===== Order created with ID: ${order.id} =====`)
            console.log(`===== Order Items created: ${order.id} =====`)
            order.items.forEach((o) => console.log(`\t ==== ${o.id} ====`))
            // TODO: Here the order is created 
        }
    } catch (error) {
        console.log(`=== Order created FAILED ===, ${error}`)
    }

    // TODO: completeOrder => add discounts, validate stock (from product.stock) and such ...
    // TODO: Change status to completed,
}

main();



async function createProduct(store: StoreManager) {
    try {
        const product = await store.create(EntityType.PRODUCT, {
            name: `Product ${Math.floor(Math.random() * 1000)}`,
            price: Math.round((1 + Math.random() * 99) * 100) / 100
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
