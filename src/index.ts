import { Entity, EntityNotFoundError, UpdateStatement } from "typeorm";
import { Customer } from "./entities/Customer";
import { Product } from "./entities/Product";
import { DatabaseManager } from "./services/database.service";
import { EntityType, StoreManager } from "./services/store";
import chalk from 'chalk';
import { Logger } from "./services/logger.service";
import { UpdateProductPayload } from "./services/product.service";
import { Order } from "./entities/Order";
import { ErrorEventName, Notifier, Notify, OnEvent, registerEventHandlers, SuccessEventName, Use } from "./services/notifier.service";
import { Cart } from "./entities/Cart";

enum Operations {
    COMPLETE_ORDER = 'Complete Order',
    CREATE_ORDER = 'Create Order',
    CREATE_PRODUCT = 'Create Product',
    CREATE_CUSTOMER = 'Create Customer',
    ADD_TO_CART = 'Add To Cart',
    RESTOCK = 'Restock',

}






class App {
    private static instance: App;
    private logger: Logger = Logger.getInstance();
    private manager: StoreManager = StoreManager.getInstance();

    private customer: Customer;
    private product: Product;
    private cart: Cart;
    private order: Order;

    private constructor() {
        const prototype = Object.getPrototypeOf(this);
        // NOTE: In Order the OnEvent to work we have to add the "logger" property to the prototype (see: OnEvent implementation NOTE)
        // NOTE: Or use the Logger.getInstance().success - which is not bound to the App class or its prototype...
        // NOTE: Also done for practicising ...
        if (!prototype.hasOwnProperty('logger')) {
            Object.defineProperty(prototype, 'logger', {
                value: Logger.getInstance(),
                writable: false,
                configurable: false,
                enumerable: false,
            });
        }
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new App();
        }
        return this.instance;
    }

    @OnEvent(SuccessEventName.DATABASE_INITIALIZED)
    handlDatabaseInitialize() {
        this.logger.bgSuccess('===== Database successfully connected =====')
    }

    @OnEvent(ErrorEventName.ERROR_DATABASE_INITIALIZED)
    handleDatabaseInitializeError(error: unknown) {
        this.logger.bgFail(`=== Database connection FAILED ===, ${error}`)
    }

    @OnEvent(SuccessEventName.PRODUCT_CREATED)
    handleProductCreated(product: Product) {
        this.logger.neutral(`=== OPERATION: ${Operations.CREATE_PRODUCT} FINISHED ===`)
        this.logger.bgSuccess(`=== RESULT: Product created with ID: ${product.id} ===`)
    }

    @OnEvent(ErrorEventName.ERROR_PRODUCT_CREATED)
    handleProductCreatedError(error: Error) {
        this.logger.fail(`=== OPERATION: ${Operations.CREATE_PRODUCT} FAILED ===, ${error}`)
    }

    @OnEvent(SuccessEventName.CUSTOMER_CREATED)
    handleCustomerCreated(customer: Customer) {
        this.logger.neutral(`=== OPERATION: ${Operations.CREATE_CUSTOMER} FINISHED ===`)
        this.logger.bgSuccess(`=== RESULT: Customer created with ID: ${customer.id} ===`)
    }

    @OnEvent(ErrorEventName.ERROR_CUSTOMER_CREATED)
    handleCustomerCreatedError(error: Error) {
        this.logger.fail(`=== OPERATION: ${Operations.CREATE_CUSTOMER} FAILED ===, ${error}`)
    }

    @OnEvent(SuccessEventName.CART_CREATED)
    handleCartCreated(cart: Cart) {
        this.logger.neutral(`=== OPERATION: ${Operations.ADD_TO_CART} FINISHED ===`)

        this.logger.bgSuccess(`=== RESULT: Cart created with ID: ${cart.id} ===`)
        this.logger.bgYellow(`=== RESULT ITEMS ===`)
        for (const item of cart) {
            this.logger.yellow(`\t +++ Cart Item ID: ${item.id} +++`)
        }
    }

    @OnEvent(ErrorEventName.ERROR_CART_CREATED)
    handleCartCreatedError(error: Error) {
        this.logger.fail(`=== OPERATION: ${Operations.ADD_TO_CART} FAILED ===, ${error}`)
    }

    @OnEvent(SuccessEventName.ORDER_CREATED)
    handleOrderCreated(order: Order) {
        this.logger.neutral(`=== OPERATION: ${Operations.CREATE_ORDER} FINISHED ===`)
        this.logger.bgSuccess(`=== RESULT: Order created with ID: ${order.id} ===`)
        this.logger.bgYellow(`=== RESULT ITEMS: ===`)
        for (const item of order) {
            this.logger.yellow(`\t +++ Order Item ID: ${item.id} +++`)
        }
    }

    @OnEvent(ErrorEventName.ERROR_ORDER_CREATED)
    handleOrderCreatedError(error: Error) {
        this.logger.fail(`=== OPERATION: ${Operations.CREATE_ORDER} FAILED ===, ${error}`)
    }

    // TODO: This uses the update (which is general event) however it is only about stock ... 
    // TODO: Log the whole previous and after (and diff);
    @OnEvent(SuccessEventName.PRODUCT_UPDATED)
    handleProductRestock(beforeUpdateProduct: Product, afterUpdateProduct: Product) {
        this.logger.neutral(`=== OPERATION: ${Operations.RESTOCK} FINISHED ===`)
        this.logger.bgYellow(`=== RESULT BEFORE RESTOCK: ${beforeUpdateProduct?.stock} ===`);
        this.logger.bgYellow(`=== RESULT AFTER RESTOCK: ${afterUpdateProduct?.stock} ===`);
    }

    @OnEvent(ErrorEventName.ERROR_PRODUCT_UPDATED)
    handleProductRestockError(error: Error) {
        this.logger.fail(`=== OPERATION: ${Operations.RESTOCK} FAILED ===, ${error}`)
    }

    @Use(registerEventHandlers)
    async run() {
        try {
            await DatabaseManager.getInstance().initialize();
        } catch (error) {
            this.logger.fail(`Something went wrong!, ${error}`)
        }

        try {
            // this.product = await this.createProduct();
            // this.customer = await this.createCustomer();
            // this.cart = await this.addToCart();
            // this.cart = await this.addToCartWithCustomerAndProduct(3, 2); // customerId 3, productId 2;
            // this.order = await this.createOrder(3); // customerId 3 or 5
            const [before, after] = await this.productRestock(2);
            this.product = after;



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
            // }
        } catch (error: any) {
            this.logger.bgFail(`${error.stack}`)
        }




    }

    // TODO: Use decorator for operation start ...;
    private async createProduct(stock?: number) {
        this.logger.neutral(`=== OPERATION: ${Operations.CREATE_PRODUCT} STARTED ===`)

        try {
            const product = await this.manager.create(EntityType.PRODUCT, {
                name: `Product ${Math.floor(Math.random() * 1000)}`,
                price: Math.round((1 + Math.random() * 99) * 100) / 100,
                stock: stock && stock > 0 ? stock : 0
            });
            return product
        } catch (error) {
            throw error
        }
    }

    private async createCustomer() {
        this.logger.neutral(`=== OPERATION: ${Operations.CREATE_CUSTOMER} STARTED ===`)

        try {
            const customer = await this.manager.create(EntityType.CUSTOMER, {
                name: `Customer ${Math.floor(Math.random() * 1000)}`,
                isPremium: Math.random() < 0.5,
            });
            return customer
        } catch (error) {
            throw error;
        }
    }

    private async addToCart() {

        this.logger.neutral(`=== OPERATION: ${Operations.ADD_TO_CART} FINISHED ===`)


        try {
            return await this.manager.addToCart({ customer: this.customer, product: this.product });
        } catch (error) {
            throw error
        }
    }

    private async addToCartWithCustomerAndProduct(customerId: number, productId: number) {
        this.logger.neutral(`=== OPERATION: ${Operations.ADD_TO_CART} STARTED ===`)

        const customer = await this.manager.getEntityById(EntityType.CUSTOMER, { id: customerId })
        if (!customer) {
            // NOTE: Have custom error class which receives automatically or passed the operation type (in this case add to cart )
            throw new Error(`Customer with ID: ${customerId} NOT FOUND!`)
        } else {
            this.customer = customer;
        }

        const product = await this.manager.getEntityById(EntityType.PRODUCT, { id: productId })
        if (!product) {
            throw new Error(`Product with ID: ${productId} NOT FOUND!`)
        } else {
            this.product = product;
        }

        try {
            return await this.manager.addToCart({ customer: this.customer, product: this.product });
        } catch (error) {
            throw error
        }
    }

    private async createOrder(customerId: number) {

        this.logger.neutral(`=== OPERATION: ${Operations.CREATE_ORDER} STARTED ===`)
        try {
            const customer = await this.manager.getEntityById(EntityType.CUSTOMER, { id: customerId, relations: ['cart', 'cart.items', 'cart.items.product'] });
            if (!customer) {
                throw new Error(`Customer with ID: ${customerId} NOT FOUND!`)
            } else {
                this.customer = customer;
                return await this.manager.create(EntityType.ORDER, { customer: this.customer });

            }
        } catch (error) {
            throw error;
        }
    }

    @Notify(SuccessEventName.PRODUCT_UPDATED, ErrorEventName.ERROR_PRODUCT_UPDATED)
    private async productRestock(productId: number): Promise<[Product, Product]> {
        this.logger.neutral(`=== OPERATION: ${Operations.RESTOCK} STARTED ===`)

        try {
            const product = await this.manager.getEntityById(EntityType.PRODUCT, { id: productId });
            if (!product) {
                throw new Error(`Product with ID: ${productId} NOT FOUND!`)
            } else {
                const updatePayload: UpdateProductPayload = {
                    id: product.id,
                    stock: product.stock + 15,
                }

                try { // NOTE: Triggers update and notify gets only the update result and not the before/after data 
                    await this.manager.update(EntityType.PRODUCT, updatePayload);
                } catch (err) {
                    throw err
                }

                const updatedProduct = await this.manager.getEntityById(EntityType.PRODUCT, { id: productId })
                if (!updatedProduct) {
                    throw new Error(`Product with ID: ${productId} NOT FOUND!`)
                }
                return [product, updatedProduct];
            }
        } catch (error) {
            throw error;
        }
    }

}

const app = App.getInstance();
app.run();