import { Logger } from "./logger.service";

export enum Operations {
    COMPLETE_ORDER = 'Complete Order',
    CREATE_ORDER = 'Create Order',
    CREATE_PRODUCT = 'Create Product',
    CREATE_CUSTOMER = 'Create Customer',
    ADD_TO_CART = 'Add To Cart',
    RESTOCK = 'Restock',
    PAY = 'Payment',
}

export class EventHandler {
    static #instance: EventHandler;
    private logger: Logger = Logger.getInstance();

    private constructor() {}

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new EventHandler();
        }
        return this.#instance
    }
    
}