import { Customer } from "./entities/Customer";
import { Product } from "./entities/Product";
import { OnEvent } from "./common/decorators/on-event";
import { Use } from "./common/decorators/use";
import { SuccessEventName, ErrorEventName } from "./common/events/notify-events";
import { EntityType } from "./common/types/domain/core";
import { CompleteOrderResponse } from "./common/types/order/response/complete-order-response";
import { ProductRestockResponse } from "./common/types/product/response/product-restock-response";
import { Cart } from "./entities/Cart";
import { Order } from "./entities/Order";
import { DatabaseManager } from "./services/database.service";
import { Logger } from "./services/logger.service";
import { StoreManager } from "./services/store";
import { Operations } from "./services/event-handler.service";
import { RegisterEventHandlers } from "./common/decorators/register-event-handlers";
import { ProductCatalog } from "./common/types/product/response/product-catalog-response";



class App {
    static #instance: App;
    
    private logger: Logger = Logger.getInstance();
    private manager: StoreManager = StoreManager.getInstance();

    private customer: Customer;
    private product: Product;
    private cart: Cart;
    private order: Order;
    private catalog: ProductCatalog;

    private constructor() {}

    public static getInstance() {
        if (!this.#instance) {
            this.#instance = new App();
        }
        return this.#instance;
    }

    @Use(RegisterEventHandlers)
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
            
            // const { afterUpdateProduct } = await this.productRestock(2, 5);
            // this.product = afterUpdateProduct;
            // const { afterCompleteOrder } = await this.completeOrder(3);
            // this.order = afterCompleteOrder

            this.catalog = await this.manager.getProductsCatalog();

        } catch (error: any) {
            this.logger.bgFail(`${error.stack}`)
        }
    }

    private async createProduct(stock?: number) {
        this.logger.neutral(`=== OPERATION: ${Operations.CREATE_PRODUCT} STARTED ===`)

            return await this.manager.create(EntityType.PRODUCT, {
                name: `Product ${Math.floor(Math.random() * 1000)}`,
                price: Math.round((1 + Math.random() * 99) * 100) / 100,
                stock: stock && stock > 0 ? stock : 0
            });
    }

    private async createCustomer() {
        this.logger.neutral(`=== OPERATION: ${Operations.CREATE_CUSTOMER} STARTED ===`)

            return  await this.manager.create(EntityType.CUSTOMER, {
                name: `Customer ${Math.floor(Math.random() * 1000)}`,
                isPremium: Math.random() < 0.5,
            });
    }

    private async addToCart() {
        this.logger.neutral(`=== OPERATION: ${Operations.ADD_TO_CART} STARTED ===`)

            return await this.manager.addToCart({ customer: this.customer, product: this.product });
    }

    private async addToCartWithCustomerAndProduct(customerId: number, productId: number) {
        this.logger.neutral(`=== OPERATION: ${Operations.ADD_TO_CART} STARTED ===`)

        const customer = await this.manager.getEntityById(EntityType.CUSTOMER, { id: customerId })
        if (!customer) {
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

            return await this.manager.addToCart({ customer: this.customer, product: this.product });
    }

    private async createOrder(customerId: number) {
        this.logger.neutral(`=== OPERATION: ${Operations.CREATE_ORDER} STARTED ===`)

            const customer = await this.manager.getEntityById(EntityType.CUSTOMER, { id: customerId, relations: ['cart', 'cart.items', 'cart.items.product'] });
            if (!customer) {
                throw new Error(`Customer with ID: ${customerId} NOT FOUND!`)
            } else {
                this.customer = customer;
                return await this.manager.create(EntityType.ORDER, { customer: this.customer });

            }
    }

    private async productRestock(productId: number, stock: number = 15): Promise<ProductRestockResponse> {
        this.logger.neutral(`=== OPERATION: ${Operations.RESTOCK} STARTED ===`)

            return await this.manager.productRestock({ id: productId, stock });
    }

    private async completeOrder(orderId: number): Promise<CompleteOrderResponse> {
        this.logger.neutral(`=== Operation: ${Operations.COMPLETE_ORDER} STARTED ===`)

            const order = await this.manager.getEntityById(EntityType.ORDER, { id: orderId, relations: ['items', 'items.product'] });
            if (!order) {
                throw new Error(`Order with ID: ${orderId} Not Found`)
            }
            return await this.manager.completeOrder(order);
    }

}

const app = App.getInstance();
app.run();