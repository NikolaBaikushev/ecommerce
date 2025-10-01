import { OnEvent } from "../common/decorators/on-event";
import { SuccessEventName, ErrorEventName } from "../common/events/notify-events";
import { CompleteOrderResponse } from "../common/types/order/response/complete-order-response";
import { ProductRestockResponse } from "../common/types/product/response/product-restock-response";
import { Cart } from "../entities/Cart";
import { Customer } from "../entities/Customer";
import { Order } from "../entities/Order";
import { Product } from "../entities/Product";
import { Logger } from "./logger.service";

export enum Operations {
    COMPLETE_ORDER = 'Complete Order',
    CREATE_ORDER = 'Create Order',
    CREATE_PRODUCT = 'Create Product',
    CREATE_CUSTOMER = 'Create Customer',
    ADD_TO_CART = 'Add To Cart',
    RESTOCK = 'Restock',

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